import { restaurantService } from '../services/index.js';
import {
  getDetailsInItems,
  getTypesInItems,
} from '../services/search.service.js';

export const addRestaurant = async (req, res) => {
  const restaurant = await restaurantService.addRestaurant(req.body);
  return res.status(201).json(restaurant);
};

export const getRestaurants = async (req, res) => {
  const { includeHidden } = req.query;
  const restaurants = await restaurantService.getRestaurants(includeHidden);
  return res.status(200).json(restaurants);
};

export const getRestaurantById = async (req, res) => {
  const { restaurantId } = req.params;
  const { includeHidden } = req.query;
  const restaurant = await restaurantService.getRestaurantById(
    restaurantId,
    includeHidden,
  );
  return res.status(200).json(restaurant);
};

// export const getRestaurantsByCity = async (req, res) => {
//   const { cityId } = req.params;
//   const { includeHidden } = req.query;
//   const restaurants = await restaurantService.getRestaurantsByCity(
//     cityId,
//     includeHidden,
//   );
//   return res.status(200).json(restaurants);
// };

export const getRestaurantsByCity = async (req, res) => {
  const { cityId } = req.params;
  const { includeHidden, returnTypesFromItems } = req.query;

  const restaurants = await restaurantService.getRestaurantsByCity(
    cityId,
    includeHidden,
  );

  if (returnTypesFromItems === 'true') {
    const types = getTypesInItems(restaurants);
    const details = getDetailsInItems(restaurants);
    return res.status(200).json({ restaurants, types, details });
  }

  return res.status(200).json(restaurants);
};

export const removeRestaurantById = async (req, res) => {
  const { restaurantId } = req.params;
  const result = await restaurantService.removeRestaurantById(restaurantId);
  return res.status(200).json({ message: 'Restaurant removed successfully' });
};

export const updateRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
  const updatedData = req.body;
  const updatedRestaurant = await restaurantService.updateRestaurant(
    restaurantId,
    updatedData,
  );
  return res.status(200).json(updatedRestaurant);
};

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
  const { includeHidden } = req.query;

  try {
    const restaurants =
      await restaurantService.getHighlightedRestaurantsByCountry(
        countryName,
        includeHidden,
      );
    return res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching highlighted restaurants by country:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getHighlightedRestaurantsByCity = async (req, res) => {
  const { cityId } = req.params;
  const { includeHidden, fallback } = req.query;

  try {
    const restaurants = await restaurantService.getHighlightedRestaurantsByCity(
      cityId,
      includeHidden,
      fallback === 'true', // convierte a booleano
    );
    return res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching highlighted restaurants by city:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const searchRestaurants = async (req, res) => {
  const { query, top_k = 20, detectedCity = null } = req.body;
  const { includeHidden } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const results = await restaurantService.searchRestaurants(
      query,
      top_k,
      detectedCity,
      includeHidden,
    );
    return res.status(200).json(results);
  } catch (error) {
    console.error('❌ Error en búsqueda de restaurantes:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
