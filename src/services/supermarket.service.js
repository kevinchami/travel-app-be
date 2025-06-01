import Country from '../models/country.js';
import Supermarket from '../models/supermarket.js';
import { buildVectorSearchPipeline } from '../utils/searchUtils.js';
import { getCityIdByName } from './city.service.js';

// Add new supermarket
export const addSupermarket = async supermarketData => {
  const supermarket = await Supermarket.create(supermarketData);
  if (!supermarket) {
    throw new Error('Failed to add supermarket');
  }
  return supermarket;
};

// Get all supermarkets
export const getSupermarkets = async () => {
  const supermarkets = await Supermarket.find();
  if (!supermarkets) {
    throw new Error('Failed to fetch supermarkets');
  }
  return supermarkets;
};

// Get supermarket by ID
export const getSupermarketById = async supermarketId => {
  const supermarket = await Supermarket.findById(supermarketId);
  if (!supermarket) {
    throw new Error('Supermarket not found');
  }
  return supermarket;
};

// Get supermarkets by city
export const getSupermarketsByCity =  async (cityId, includeHidden = false) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  const supermarkets = await Supermarket.find({ city: cityId }, null, options);
  if (!supermarkets) {
    throw new Error('Failed to fetch supermarkets by city');
  }
  return supermarkets;
};

// Remove supermarket by ID
export const removeSupermarketById = async supermarketId => {
  const result = await Supermarket.findByIdAndDelete(supermarketId);
  if (!result) {
    throw new Error('Failed to remove supermarket');
  }
  return result;
};

// Update supermarket
export const updateSupermarket = async (supermarketId, updatedData) => {
  const updatedSupermarket = await Supermarket.findByIdAndUpdate(
    supermarketId,
    updatedData,
    { new: true },
  );
  if (!updatedSupermarket) {
    throw new Error('Supermarket not found');
  }
  return updatedSupermarket;
};

// Get distinct types for filtering
export const getDistinctTypes = async () => {
  try {
    const rawTypes = await Supermarket.distinct('type');
    if (!rawTypes) {
      throw new Error('Failed to fetch distinct types');
    }

    const splitTypes = rawTypes.reduce((acc, typeString) => {
      return acc.concat(typeString.split(',').map(type => type.trim()));
    }, []);

    const distinctTypes = Array.from(new Set(splitTypes));
    return distinctTypes;
  } catch (error) {
    console.error('Error fetching distinct types:', error);
    throw new Error(error.message);
  }
};

// Get highlighted supermarkets by country
export const getHighlightedSupermarketsByCountry = async countryName => {
  const country = await Country.findOne({ name: countryName });

  if (!country) {
    throw new Error('Country not found');
  }

  const supermarkets = await Supermarket.find({
    countryId: country._id.toString(),
    highlighted: true,
  }).sort({ priority: 1 });

  return supermarkets;
};

// Search supermarkets (vector-based)
export const searchSupermarkets = async (
  query,
  top_k = 20,
  detectedCity = null,
) => {
  const pipeline = await buildVectorSearchPipeline(
    query,
    'vector_index',
    top_k,
  );
  if (!pipeline) return [];

  const isKosherQuery = query.toLowerCase().includes('kosher');

  if (isKosherQuery) {
    pipeline.push({ $match: { kosherBoolean: true } });
  }

  if (detectedCity) {
    const cityId = await getCityIdByName(detectedCity);
    if (cityId) {
      pipeline.push({ $match: { city: cityId } });
    }
  }

  try {
    const results = await Supermarket.aggregate(pipeline);
    console.log(`✅ Found ${results.length} supermarkets`);
    return results;
  } catch (error) {
    console.error('❌ Error searching supermarkets:', error);
    return [];
  }
};

export const getHighlightedSupermarketsByCity = async (
  cityId,
  includeHidden = false,
) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};

  return await Supermarket.find(
    { city: cityId, highlighted: true },
    null,
    options,
  ).sort({ priority: 1 });
};
