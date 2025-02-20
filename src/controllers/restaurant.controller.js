// controllers/restaurantController.js

import { restaurantService } from '../services/index.js';

// Add new restaurant
export const addRestaurant = async (req, res) => {
  const restaurant = await restaurantService.addRestaurant(req.body);
  return res.status(201).json(restaurant);
};

// Get all restaurants
export const getRestaurants = async (req, res) => {
  const restaurants = await restaurantService.getRestaurants();
  return res.status(200).json(restaurants);
};

// Get restaurant by ID
export const getRestaurantById = async (req, res) => {
  const { restaurantId } = req.params;
  const restaurant = await restaurantService.getRestaurantById(restaurantId);
  return res.status(200).json(restaurant);
};

// Get restaurants by city
export const getRestaurantsByCity = async (req, res) => {
  const { cityId } = req.params;
  const restaurants = await restaurantService.getRestaurantsByCity(cityId);
  return res.status(200).json(restaurants);
};

// Remove restaurant by ID
export const removeRestaurantById = async (req, res) => {
  const { restaurantId } = req.params;
  const result = await restaurantService.removeRestaurantById(restaurantId);
  return res.status(200).json({ message: 'Restaurant removed successfully' });
};

// Update restaurant
export const updateRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
  const updatedData = req.body;
  const updatedRestaurant = await restaurantService.updateRestaurant(
    restaurantId,
    updatedData,
  );
  return res.status(200).json(updatedRestaurant);
};

// Get distinct types for filtering
export const getDistinctTypes = async (req, res) => {
  try {
    const distinctTypes = await restaurantService.getDistinctTypes();
    return res.status(200).json(distinctTypes);
  } catch (error) {
    console.error('Error fetching distinct types:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getHighlightedRestaurantsByCountry = async (req, res) => {
  const { countryName } = req.params;

  try {
    const restaurants =
      await restaurantService.getHighlightedRestaurantsByCountry(countryName);
    return res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching highlighted restaurants by country:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const searchRestaurants = async (req, res) => {
  const { query, top_k = 20 } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const results = await restaurantService.searchRestaurants(query, top_k);
    return res.status(200).json(results);
  } catch (error) {
    console.error('❌ Error en búsqueda de restaurantes:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
