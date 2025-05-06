// import { searchInPinecone } from '../services/search.service.js';

import {
  cleanNeighborhoods,
  cleanTypes,
  getNeighborhoodsByCity,
  getTypesByCollection,
  searchInMongoDB,
  simpleSearchInMongoDB,
} from '../services/search.service.js';

export const search = async (req, res) => {
  const { query, top_k } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const results = await searchInMongoDB(query, top_k); // Correct function name
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error searching:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const searchSimple = async (req, res) => {
  const { query = '', filters = {}, model = null } = req.body;

  // Si no hay query y no hay filtros → error
  if (!query.trim() && Object.keys(filters).length === 0) {
    return res
      .status(400)
      .json({ error: 'At least query or filters are required' });
  }

  try {
    const results = await simpleSearchInMongoDB(query, filters, 50, model);
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error in simple search:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getTypes = async (req, res) => {
  const { collection } = req.query;

  if (!collection) {
    return res.status(400).json({ error: 'Collection parameter is required' });
  }

  try {
    const rawTypes = await getTypesByCollection(collection);
    const cleanedTypes = cleanTypes(rawTypes);
    return res.status(200).json(cleanedTypes);
  } catch (error) {
    console.error('Error getting types:', error);
    return res.status(400).json({ error: error.message });
  }
};

export const getNeighborhoods = async (req, res) => {
  const { collection, cityId } = req.query;

  if (!collection || !cityId) {
    return res
      .status(400)
      .json({ error: 'Collection and cityId are required' });
  }

  try {
    const rawNeighborhoods = await getNeighborhoodsByCity(collection, cityId);
    const cleanedNeighborhoods = cleanNeighborhoods(rawNeighborhoods);
    return res.status(200).json(cleanedNeighborhoods);
  } catch (error) {
    console.error('Error getting neighborhoods:', error);
    return res.status(400).json({ error: error.message });
  }
};
