// services/restaurantService.js

import Restaurant from '../models/restaurant.js';

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
