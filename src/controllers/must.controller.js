// controllers/mustController.js

import { mustService } from '../services/index.js';

export const addMust = async (req, res) => {
  try {
    const must = await mustService.addMust(req.body);
    return res.status(201).json(must);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getMusts = async (req, res) => {
  try {
    const { includeHidden } = req.query;
    const musts = await mustService.getMusts(includeHidden);
    return res.status(200).json(musts);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Controller: Get distinct types for filtering by country
export const getDistinctTypes = async (req, res) => {
  const { countryId } = req.query; // Obtener countryId de los parámetros de la consulta
  try {
    const distinctTypes = await mustService.getDistinctTypes(countryId);
    return res.status(200).json(distinctTypes);
  } catch (error) {
    console.error('Error fetching distinct types:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getMustById = async (req, res) => {
  try {
    const { mustId } = req.params;
    const { includeHidden } = req.query;
    const must = await mustService.getMustById(mustId, includeHidden);
    return res.status(200).json(must);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getMustsByCountry = async (req, res) => {
  try {
    const { countryId } = req.params;
    const { includeHidden } = req.query;
    const musts = await mustService.getMustsByCountry(countryId, includeHidden);
    return res.status(200).json(musts);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getMustsByCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { includeHidden } = req.query;
    const musts = await mustService.getMustsByCity(cityId, includeHidden);
    return res.status(200).json(musts);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const removeMustById = async (req, res) => {
  try {
    const { mustId } = req.params;
    await mustService.removeMustById(mustId);
    return res.status(200).json({ message: 'Must removed successfully' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const updateMust = async (req, res) => {
  try {
    const { mustId } = req.params;
    const updatedData = req.body;
    const updatedMust = await mustService.updateMust(mustId, updatedData);
    return res.status(200).json(updatedMust);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
