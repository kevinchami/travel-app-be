// services/cafeService.js

import Cafe from '../models/cafe.js'; // Ensure the Cafe model exists in your models directory
import { buildVectorSearchPipeline } from '../utils/searchUtils.js';
import { getCityIdByName } from './city.service.js';

// Add new cafe
export const addCafe = async cafeData => {
  debugger;
  const cafe = await Cafe.create(cafeData);
  if (!cafe) {
    throw new Error('Failed to add cafe');
  }
  return cafe;
};

// Get all cafes
export const getCafes = async () => {
  const cafes = await Cafe.find();
  if (!cafes) {
    throw new Error('Failed to fetch cafes');
  }
  return cafes;
};

// Get cafe by ID
export const getCafeById = async cafeId => {
  const cafe = await Cafe.findById(cafeId);
  if (!cafe) {
    throw new Error('Cafe not found');
  }
  return cafe;
};

// Get cafes by city
export const getCafesByCity = async cityId => {
  const cafes = await Cafe.find({ city: cityId });
  if (!cafes) {
    throw new Error('Failed to fetch cafes by city');
  }
  return cafes;
};

// Remove cafe by ID
export const removeCafeById = async cafeId => {
  const result = await Cafe.findByIdAndDelete(cafeId);
  if (!result) {
    throw new Error('Failed to remove cafe');
  }
  return result;
};

// Update cafe
export const updateCafe = async (cafeId, updatedData) => {
  const updatedCafe = await Cafe.findByIdAndUpdate(
    cafeId,
    updatedData,
    { new: true }, // This option returns the document after update was applied
  );
  if (!updatedCafe) {
    throw new Error('Cafe not found');
  }
  return updatedCafe;
};

// Get distinct types for filtering
export const getDistinctTypes = async () => {
  const distinctTypes = await Cafe.distinct('type');
  if (!distinctTypes) {
    throw new Error('Failed to fetch distinct types');
  }
  return distinctTypes;
};

export const searchCafes = async (query, top_k = 20, detectedCity = null) => {
  const pipeline = await buildVectorSearchPipeline(query, 'cafe_vector_index', top_k);
  if (!pipeline) return [];

  const lowerQuery = query.toLowerCase();

  const isKosherQuery = query.toLowerCase().includes('kosher');
  const isSpecialtyCoffeeQuery =
    lowerQuery.includes('specialty coffee') ||
    lowerQuery.includes('specialty cafe') ||
    lowerQuery.includes('third wave coffee') ||
    lowerQuery.includes('barista');

  if (isKosherQuery) {
    pipeline.push({ $match: { kosherBoolean: true } });
  }
  if (isSpecialtyCoffeeQuery) {
    pipeline.push({ $match: { type: 'Specialty Coffee' } });
  }
  if (detectedCity) {
    const cityId = await getCityIdByName(detectedCity);
    if (cityId) {
      pipeline.push({ $match: { city: cityId } });
    }
  }

  try {
    const results = await Cafe.aggregate(pipeline);
    console.log(`✅ Se encontraron ${results.length} cafes`);
    return results;
  } catch (error) {
    console.error('❌ Error en búsqueda de cafes:', error);
    return [];
  }
};
