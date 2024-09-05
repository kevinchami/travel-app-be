// services/cafeService.js

import Cafe from '../models/cafe.js'; // Ensure the Cafe model exists in your models directory

// Add new cafe
export const addCafe = async cafeData => {
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
