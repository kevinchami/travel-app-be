// import { searchInPinecone } from '../services/search.service.js';

import { searchInMongoDB } from "../services/search.service.js";

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
