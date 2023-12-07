// services/restaurantService.js

import Restaurant from '../models/restaurant.js';

// Add new restaurant
export const addRestaurant = async restaurantData => {
  console.log('hi');
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
  const result = await Restaurant.findByIdAndRemove(restaurantId);
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
export const getDistinctTypes = async () => {
  const distinctTypes = await Restaurant.distinct('type');
  if (!distinctTypes) {
    throw new Error('Failed to fetch distinct types');
  }
  return distinctTypes;
};
