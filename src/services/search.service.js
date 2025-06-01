import dotenv from 'dotenv';
import { translateToEnglish } from '../utils/translation.js';
import { detectCollection } from '../utils/queryClassifier.js';
import { searchRestaurants } from './restaurant.service.js';
import { searchCafes } from './cafe.service.js';
import { extractCityFromQuery } from '../utils/extractCityFromQuery.js';
import Restaurant from '../models/restaurant.js';
import Cafe from '../models/cafe.js';
import Party from '../models/party.js';
import Tour from '../models/tour.js';
import Temple from '../models/temple.js';
import Accomodation from '../models/accomodation.js';
import diacritics from 'diacritics';
import { searchParties } from './party.service.js';
import Must from '../models/must.js';

dotenv.config();

const collections = {
  restaurant: Restaurant,
  cafe: Cafe,
  party: Party,
  tour: Tour,
  temple: Temple,
  accommodation: Accomodation,
  must: Must,
};

export const searchInMongoDB = async (query, top_k = 10) => {
  const translatedQuery = await translateToEnglish(query, { to: 'en' });
  const collection = await detectCollection(translatedQuery);
  const detectedCity = extractCityFromQuery(translatedQuery);

  let exactMatches = [];

  const normalizedQuery = diacritics.remove(query.toLowerCase());

  for (const [collectionName, model] of Object.entries(collections)) {
    const directMatches = await model.find({
      name: { $regex: diacritics.remove(normalizedQuery), $options: 'i' },
    });

    if (directMatches.length > 0) {
      directMatches.forEach(match => {
        console.log(
          `✅ Se encontró coincidencia en ${collectionName}: ${match.name}`,
        );
        exactMatches.push(match);
      });
    }
  }

  if (!collection) {
    console.log(
      '❌ No se pudo identificar la colección para la consulta:',
      query,
    );
    return exactMatches; // Retornamos solo los exactos si no se detecta colección
  }

  console.log(`🔍 Buscando en la colección: ${collection}`);

  let semanticResults = [];
  switch (collection) {
    case 'restaurant':
      semanticResults = await searchRestaurants(
        translatedQuery,
        top_k,
        detectedCity,
      );
      break;
    case 'cafe':
      semanticResults = await searchCafes(translatedQuery, top_k, detectedCity);
      break;
    case 'party':
      semanticResults = await searchParties(query, top_k, detectedCity);
      break;
    // case 'tour':
    //   semanticResults = await searchTours(query, top_k);
    //   break;
    // case 'temple':
    //   semanticResults = await searchTemples(query, top_k);
    //   break;
    // case 'accomodation':
    //   semanticResults = await searchAccommodations(query, top_k);
    //   break;
    default:
      return exactMatches;
  }

  // 🔥 Combinar resultados sin duplicados
  const combinedResults = [...exactMatches, ...semanticResults].filter(
    (value, index, self) =>
      index === self.findIndex(v => v._id.toString() === value._id.toString()),
  );

  console.log(`🔍 Resultados combinados: ${combinedResults.length}`);
  return combinedResults;
};
const buildFilterConditions = filters => {
  const conditions = [];

  // Mantener lógica existente
  if (filters.highlighted !== undefined) {
    conditions.push({ highlighted: filters.highlighted });
  }

  if (
    filters.types &&
    Array.isArray(filters.types) &&
    filters.types.length > 0
  ) {
    const regexArray = filters.types.map(type => new RegExp(type, 'i'));
    conditions.push({
      $or: regexArray.map(regex => ({ type: regex })),
    });
  }
  // Filtro Details
  if (
    filters.details &&
    Array.isArray(filters.details) &&
    filters.details.length > 0
  ) {
    const regexArray = filters.details.map(detail => new RegExp(detail, 'i'));
    conditions.push({
      $or: regexArray.map(regex => ({ details: regex })),
    });
  }

  if (filters.neighborhood) {
    conditions.push({ neighborhood: filters.neighborhood });
  }

  if (filters.bookingNeeded !== undefined) {
    conditions.push({ bookingNeeded: filters.bookingNeeded });
  }
  // AGREGAR NUEVOS FILTROS:

  // Filtro JFLEX
  if (filters.jflex && Array.isArray(filters.jflex)) {
    if (filters.jflex.includes('Only JFLEX')) {
      conditions.push({ textHebrew: true });
    }
  }

  // Filtro Highlighted (desde array)
  if (filters.highlighted && Array.isArray(filters.highlighted)) {
    if (filters.highlighted.includes('Only Highlighted')) {
      conditions.push({ highlighted: true });
    }
  }

  // Filtro Rating
  if (filters.rating && Array.isArray(filters.rating)) {
    const ratingConditions = [];
    filters.rating.forEach(rating => {
      if (rating === '4+') ratingConditions.push({ rating: { $gte: 4 } });
      if (rating === '4.5+') ratingConditions.push({ rating: { $gte: 4.5 } });
      if (rating === '5') ratingConditions.push({ rating: { $eq: 5 } });
    });

    if (ratingConditions.length > 0) {
      conditions.push({ $or: ratingConditions });
    }
  }

  // Filtro Kosher
  if (filters.kosherBoolean && Array.isArray(filters.kosherBoolean)) {
    if (filters.kosherBoolean.includes('Kosher Only')) {
      conditions.push({ kosherBoolean: true });
    }
  }
  // Filtro por details (campo de texto, se usa regex para coincidencias parciales)
  if (filters.details && Array.isArray(filters.details)) {
    const regexArray = filters.details.map(d => new RegExp(d, 'i'));
    conditions.push({
      $or: regexArray.map(regex => ({ details: regex })),
    });
  }

  if (conditions.length === 0) {
    return {}; // sin filtros extra
  }

  return { $and: conditions };
};

export const simpleSearchInMongoDB = async (
  query,
  filters = {},
  limitPerCollection = 50,
  modelName = null,
) => {
  console.log('model!!', modelName);
  const results = [];
  const fuzzyRegex = query.split('').join('.*');
  const hasQuery = query && query.trim() !== '';

  // Si modelName está definido, usamos solo esa colección
  const collectionsToSearch = modelName
    ? { [modelName]: collections[modelName] }
    : collections;

  for (const [collectionName, model] of Object.entries(collectionsToSearch)) {
    let collectionResults = [];

    let baseFilter;
    if (hasQuery) {
      try {
        baseFilter = {
          $and: [{ $text: { $search: query } }, buildFilterConditions(filters)],
        };
        collectionResults = await model
          .find(baseFilter, { score: { $meta: 'textScore' } })
          .sort({ score: { $meta: 'textScore' } })
          .limit(limitPerCollection);
      } catch (err) {
        console.warn(
          `⚠️ No $text index in ${collectionName}, falling back to regex`,
        );
        baseFilter = {
          $and: [
            {
              $or: [
                { name: { $regex: fuzzyRegex, $options: 'i' } },
                { type: { $regex: fuzzyRegex, $options: 'i' } },
              ],
            },
            buildFilterConditions(filters),
          ],
        };
        collectionResults = await model
          .find(baseFilter)
          .limit(limitPerCollection);
      }
    } else {
      baseFilter = buildFilterConditions(filters);
      collectionResults = await model
        .find(baseFilter)
        .limit(limitPerCollection);
    }

    if (collectionResults.length > 0) {
      collectionResults.forEach(item => {
        results.push({
          ...item.toObject(),
          collection: collectionName,
        });
      });
    }
  }

  return results;
};

export const cleanTypes = rawTypesArray => {
  const uniqueTypes = new Set();

  rawTypesArray.forEach(typeStr => {
    // separa por coma, limpia espacios y mete en el Set
    typeStr.split(',').forEach(subType => {
      const trimmed = subType.trim();
      if (trimmed) {
        uniqueTypes.add(trimmed);
      }
    });
  });

  return Array.from(uniqueTypes).sort();
};

export const getTypesByCollection = async collectionName => {
  const model = collections[collectionName];
  if (!model) {
    throw new Error(`Invalid collection name: ${collectionName}`);
  }

  const types = await model.distinct('type', { hide: { $ne: true } });

  return types;
};

export const cleanNeighborhoods = rawNeighborhoodsArray => {
  const uniqueNeighborhoods = new Set();

  rawNeighborhoodsArray.forEach(neigh => {
    const trimmed = neigh.trim();
    if (trimmed) {
      uniqueNeighborhoods.add(trimmed);
    }
  });

  return Array.from(uniqueNeighborhoods).sort();
};

export const getNeighborhoodsByCity = async (collectionName, cityId) => {
  const model = collections[collectionName];
  if (!model) {
    throw new Error(`Invalid collection name: ${collectionName}`);
  }

  // Busca solo los neighborhoods para la ciudad especificada
  const neighborhoods = await model.distinct('neighborhood', { city: cityId });

  return neighborhoods;
};
