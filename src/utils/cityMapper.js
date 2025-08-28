import { CITIES } from '../constants/cities.js';

// Create a reverse mapping from ObjectId to city name for easier lookups
const CITY_ID_TO_NAME = {};
const CITY_NAME_TO_ID = {};

Object.entries(CITIES).forEach(([key, objectId]) => {
  const objectIdStr = objectId.toString();
  CITY_ID_TO_NAME[objectIdStr] = key.toLowerCase();
  CITY_NAME_TO_ID[key.toLowerCase()] = objectIdStr;
});

export const getCityIdByName = cityName => {
  if (!cityName) return null;

  // Normalize the city name for comparison
  const normalizedName = cityName.toLowerCase().trim();

  // Return the ObjectId as a string if found
  return CITY_NAME_TO_ID[normalizedName] || null;
};

export const getCityNameById = cityId => {
  if (!cityId) return null;

  // Convert to string if it's an ObjectId
  const cityIdStr = cityId.toString();

  // Return the city name if found
  return CITY_ID_TO_NAME[cityIdStr] || null;
};
