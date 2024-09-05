// services/templeService.js

import Temple from '../models/temple.js';

// Add new temple
export const addTemple = async templeData => {
  const temple = await Temple.create(templeData);
  if (!temple) {
    throw new Error('Failed to add temple');
  }
  return temple;
};

// Get all temples
export const getTemples = async () => {
  const temples = await Temple.find();
  if (!temples) {
    throw new Error('Failed to fetch temples');
  }
  return temples;
};

// Get temple by ID
export const getTempleById = async templeId => {
  const temple = await Temple.findById(templeId);
  if (!temple) {
    throw new Error('Temple not found');
  }
  return temple;
};

// Get temples by city
export const getTemplesByCity = async cityId => {
  const temples = await Temple.find({ city: cityId });
  if (!temples) {
    throw new Error('Failed to fetch temples by city');
  }
  return temples;
};

// Remove temple by ID
export const removeTempleById = async templeId => {
  const result = await Temple.findByIdAndDelete(templeId);
  if (!result) {
    throw new Error('Failed to remove temple');
  }
  return result;
};

// Update temple
export const updateTemple = async (templeId, updatedData) => {
  const updatedTemple = await Temple.findByIdAndUpdate(templeId, updatedData, {
    new: true,
  });
  if (!updatedTemple) {
    throw new Error('Temple not found');
  }
  return updatedTemple;
};
