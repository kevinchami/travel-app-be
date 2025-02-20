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

dotenv.config();

export const searchInMongoDB = async (query, top_k = 10) => {
  const translatedQuery = await translateToEnglish(query, { to: 'en' });
  const collection = await detectCollection(translatedQuery);
  const detectedCity = extractCityFromQuery(translatedQuery);

  const collections = {
    restaurant: Restaurant,
    cafe: Cafe,
    party: Party,
    tour: Tour,
    temple: Temple,
    accomodation: Accomodation,
  };

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
