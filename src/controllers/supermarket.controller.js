import { supermarketService } from '../services/index.js';

// Add new supermarket
export const addSupermarket = async (req, res) => {
  const supermarket = await supermarketService.addSupermarket(req.body);
  return res.status(201).json(supermarket);
};

// Get all supermarkets
export const getSupermarkets = async (req, res) => {
  const supermarkets = await supermarketService.getSupermarkets();
  return res.status(200).json(supermarkets);
};

// Get supermarket by ID
export const getSupermarketById = async (req, res) => {
  const { supermarketId } = req.params;
  const supermarket =
    await supermarketService.getSupermarketById(supermarketId);
  return res.status(200).json(supermarket);
};

// Get supermarkets by city
export const getSupermarketsByCity = async (req, res) => {
  const { cityId } = req.params;
  const supermarkets = await supermarketService.getSupermarketsByCity(cityId);
  return res.status(200).json(supermarkets);
};

// Remove supermarket by ID
export const removeSupermarketById = async (req, res) => {
  const { supermarketId } = req.params;
  await supermarketService.removeSupermarketById(supermarketId);
  return res.status(200).json({ message: 'Supermarket removed successfully' });
};

// Update supermarket
export const updateSupermarket = async (req, res) => {
  const { supermarketId } = req.params;
  const updatedData = req.body;
  const updatedSupermarket = await supermarketService.updateSupermarket(
    supermarketId,
    updatedData,
  );
  return res.status(200).json(updatedSupermarket);
};

// Get distinct types for filtering
export const getDistinctTypes = async (req, res) => {
  try {
    const distinctTypes = await supermarketService.getDistinctTypes();
    return res.status(200).json(distinctTypes);
  } catch (error) {
    console.error('Error fetching distinct types:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getHighlightedSupermarketsByCountry = async (req, res) => {
  const { countryName } = req.params;

  try {
    const supermarkets =
      await supermarketService.getHighlightedSupermarketsByCountry(countryName);
    return res.status(200).json(supermarkets);
  } catch (error) {
    console.error('Error fetching highlighted supermarkets by country:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const searchSupermarkets = async (req, res) => {
  const { query, top_k = 20 } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const results = await supermarketService.searchSupermarkets(query, top_k);
    return res.status(200).json(results);
  } catch (error) {
    console.error('❌ Error en búsqueda de supermercados:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getHighlightedSupermarketsByCity = async (req, res) => {
  const { cityId } = req.params;

  try {
    const supermarkets =
      await supermarketService.getHighlightedSupermarketsByCity(cityId);
    return res.status(200).json(supermarkets);
  } catch (error) {
    console.error('❌ Error getting highlighted supermarkets by city:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
