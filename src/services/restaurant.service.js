// services/restaurantService.js

import Country from '../models/country.js';
import Restaurant from '../models/restaurant.js';
import { buildVectorSearchPipeline } from '../utils/searchUtils.js';
import { getCityIdByName } from './city.service.js';

// Add new restaurant
export const addRestaurant = async restaurantData => {
  const restaurant = await Restaurant.create(restaurantData);
  if (!restaurant) {
    throw new Error('Failed to add restaurant');
  }
  return restaurant;
};

// Get all restaurants
export const getRestaurants = async (includeHidden = false) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  return await Restaurant.find({}, null, options);
};

// Get restaurant by ID
export const getRestaurantById = async (
  restaurantId,
  includeHidden = false,
) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  const restaurant = await Restaurant.findById(restaurantId, null, options);
  if (!restaurant) throw new Error('Restaurant not found');
  return restaurant;
};

// Get restaurants by city
export const getRestaurantsByCity = async (cityId, includeHidden = false) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};
  return await Restaurant.find({ city: cityId }, null, options);
};

// Remove restaurant by ID
export const removeRestaurantById = async restaurantId => {
  const result = await Restaurant.findByIdAndDelete(restaurantId);
  if (!result) {
    throw new Error('Failed to remove restaurant');
  }
  return result;
};

// Update restaurant
export const updateRestaurant = async (restaurantId, updatedData) => {
  const updatedRestaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    updatedData,
    { new: true },
  );
  if (!updatedRestaurant) {
    throw new Error('Restaurant not found');
  }
  return updatedRestaurant;
};

// Get distinct types for filtering
/*
export const getDistinctTypes = async () => {
  const distinctTypes = await Restaurant.distinct('type');
  if (!distinctTypes) {
    throw new Error('Failed to fetch distinct types');
  }
  return distinctTypes;
};
*/

export const getDistinctTypes = async () => {
  try {
    const rawTypes = await Restaurant.distinct('type');
    if (!rawTypes) {
      throw new Error('Failed to fetch distinct types');
    }
    // Split each type string into individual types and flatten the array
    const splitTypes = rawTypes.reduce((acc, typeString) => {
      // Split by comma and trim whitespace, then add to accumulator array
      return acc.concat(typeString.split(',').map(type => type.trim()));
    }, []);

    // Remove duplicates by converting to a Set and back to an array
    const distinctTypes = Array.from(new Set(splitTypes));
    return distinctTypes;
  } catch (error) {
    console.error('Error fetching distinct types:', error);
    throw new Error(error.message);
  }
};

export const getHighlightedRestaurantsByCountry = async (
  countryName,
  includeHidden = false,
) => {
  const country = await Country.findOne({ name: countryName });
  if (!country) throw new Error('Country not found');

  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};

  return await Restaurant.find(
    { countryId: country._id.toString(), highlighted: true },
    null,
    options,
  ).sort({ priority: 1 });
};

export const getHighlightedRestaurantsByCity = async (
  cityId,
  includeHidden = false,
) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};

  return await Restaurant.find(
    { city: cityId, highlighted: true },
    null,
    options,
  ).sort({ priority: 1 });
};

export const getRestaurantsWithDiscount = async (includeHidden = false) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};

  return await Restaurant.find({ discount: true }, null, options).sort({
    priority: 1,
  });
};

export const getRestaurantsWithDiscountByCity = async (
  cityId,
  includeHidden = false,
) => {
  const options = includeHidden === 'true' ? { includeHidden: 'true' } : {};

  return await Restaurant.find(
    { city: cityId, discount: true },
    null,
    options,
  ).sort({ percentageDiscount: -1, priority: 1 });
};

export const searchRestaurants = async (
  query,
  top_k = 20,
  detectedCity = null,
  includeHidden = false,
) => {
  const pipeline = await buildVectorSearchPipeline(
    query,
    'vector_index',
    top_k,
  );
  if (!pipeline) return [];

  const isKosherQuery = query.toLowerCase().includes('kosher');

  if (isKosherQuery) pipeline.push({ $match: { kosherBoolean: true } });
  if (detectedCity) {
    const cityId = await getCityIdByName(detectedCity);
    if (cityId) pipeline.push({ $match: { city: cityId } });
  }

  if (includeHidden !== 'true') {
    pipeline.push({ $match: { hide: { $ne: true } } });
  }

  try {
    const results = await Restaurant.aggregate(pipeline);
    console.log(`✅ Se encontraron ${results.length} restaurantes`);
    return results;
  } catch (error) {
    console.error('❌ Error en búsqueda de restaurantes:', error);
    return [];
  }
};
