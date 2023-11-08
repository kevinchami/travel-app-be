// controllers/templeController.js

import { templeService } from '../services/index.js';

// Add new temple
export const addTemple = async (req, res) => {
  const temple = await templeService.addTemple(req.body);
  return res.status(201).json(temple);
};

// Get all temples
export const getTemples = async (req, res) => {
  const temples = await templeService.getTemples();
  return res.status(200).json(temples);
};

// Get temple by ID
export const getTempleById = async (req, res) => {
  const { templeId } = req.params;
  const temple = await templeService.getTempleById(templeId);
  return res.status(200).json(temple);
};

// Remove temple by ID
export const removeTempleById = async (req, res) => {
  const { templeId } = req.params;
  const result = await templeService.removeTempleById(templeId);
  return res.status(200).json({ message: 'Temple removed successfully' });
};

// Get temples by city
export const getTemplesByCity = async (req, res) => {
  const { cityId } = req.params;
  const temples = await templeService.getTemplesByCity(cityId);
  return res.status(200).json(temples);
};

// Update temple
export const updateTemple = async (req, res) => {
  const { templeId } = req.params;
  const updatedData = req.body;
  const updatedTemple = await templeService.updateTemple(templeId, updatedData);
  return res.status(200).json(updatedTemple);
};
