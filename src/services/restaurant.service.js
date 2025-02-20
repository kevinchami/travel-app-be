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
export const getRestaurants = async () => {
  const restaurants = await Restaurant.find();

  if (!restaurants) {
    throw new Error('Failed to fetch restaurants');
  }
  return restaurants;
};

// Get restaurant by ID
export const getRestaurantById = async restaurantId => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  return restaurant;
};

// Get restaurants by city
export const getRestaurantsByCity = async cityId => {
  const restaurants = await Restaurant.find({ city: cityId });
  if (!restaurants) {
    throw new Error('Failed to fetch restaurants by city');
  }
  return restaurants;
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

export const getHighlightedRestaurantsByCountry = async countryName => {
  const country = await Country.findOne({ name: countryName });

  if (!country) {
    throw new Error('Country not found');
  }

  const restaurants = await Restaurant.find({
    countryId: country._id.toString(), // Asegúrate de que la comparación sea con un String
    highlighted: true,
  }).sort({ priority: 1 });

  return restaurants;
};

export const searchRestaurants = async (query, top_k = 20, detectedCity = null) => {
  const pipeline = await buildVectorSearchPipeline(query, 'vector_index', top_k);
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
    const results = await Restaurant.aggregate(pipeline);
    console.log(`✅ Se encontraron ${results.length} restaurantes`);
    return results;
  } catch (error) {
    console.error('❌ Error en búsqueda de restaurantes:', error);
    return [];
  }
};
