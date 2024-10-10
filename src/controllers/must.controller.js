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
    const musts = await mustService.getMusts();
    return res.status(200).json(musts);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getMustById = async (req, res) => {
  try {
    const { mustId } = req.params;
    const must = await mustService.getMustById(mustId);
    return res.status(200).json(must);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const getMustsByCountry = async (req, res) => {
    try {
      const { countryId } = req.params;
      const musts = await mustService.getMustsByCountry(countryId);
      return res.status(200).json(musts);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

export const getMustsByCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const musts = await mustService.getMustsByCity(cityId);
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
