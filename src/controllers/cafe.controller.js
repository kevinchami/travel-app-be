// controllers/cafeController.js

import { cafeService } from '../services/index.js';

// Add new cafe
export const addCafe = async (req, res) => {
  const cafe = await cafeService.addCafe(req.body);
  return res.status(201).json(cafe);
};

// Get all cafes
export const getCafes = async (req, res) => {
  const cafes = await cafeService.getCafes();
  return res.status(200).json(cafes);
};

// Get cafe by ID
export const getCafeById = async (req, res) => {
  const { cafeId } = req.params;
  const cafe = await cafeService.getCafeById(cafeId);
  return res.status(200).json(cafe);
};

// Get cafes by city
export const getCafesByCity = async (req, res) => {
  const { cityId } = req.params;
  const cafes = await cafeService.getCafesByCity(cityId);
  return res.status(200).json(cafes);
};

// Remove cafe by ID
export const removeCafeById = async (req, res) => {
  const { cafeId } = req.params;
  const result = await cafeService.removeCafeById(cafeId);
  return res.status(200).json({ message: 'Cafe removed successfully' });
};

// Update cafe
export const updateCafe = async (req, res) => {
  const { cafeId } = req.params;
  const updatedData = req.body;
  const updatedCafe = await cafeService.updateCafe(cafeId, updatedData);
  return res.status(200).json(updatedCafe);
};

// Get distinct types for filtering cafes
export const getDistinctCafeTypes = async (req, res) => {
  try {
    const distinctTypes = await cafeService.getDistinctTypes();
    return res.status(200).json(distinctTypes);
  } catch (error) {
    console.error('Error fetching distinct cafe types:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
