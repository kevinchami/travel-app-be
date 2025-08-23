import {
  aiParseQuery,
} from '../services/aiParsing.service.js';

import {
  aiSearchOrchestrator,
  simpleAiSearch,
  getAllTypes,
  getAllNeighborhoods,
  getTypesFromItems,
} from '../services/aiSearch.service.js';

export const aiSearchController = {
  // Orchestrated AI search: parse text -> build structured intent -> query per collection -> merge
  async search(req, res) {
    const { query, top_k = 10 } = req.body || {};
    if (!query) return res.status(400).json({ error: 'Query text is required' });

    try {
      // Step 1: parse with AI to a normalized intent
      const intent = await aiParseQuery(query);

      // Step 2: orchestrate search across collections
      const results = await aiSearchOrchestrator(intent, top_k);

      return res.status(200).json({ 
        intent, 
        count: results.length, 
        items: results,
        searchMethod: "hybrid"
      });
    } catch (error) {
      console.error("Search error:", error);
      return res.status(500).json({ error: 'Search failed', details: error.message });
    }
  },

  // Lighter flow: supports free text or filters directly
  async searchSimple(req, res) {
    const { query = '', filters = {}, limit = 50, model = null } = req.body || {};
    if (!query.trim() && Object.keys(filters).length === 0) {
      return res.status(400).json({ error: 'At least query or filters are required' });
    }

    try {
      const items = await simpleAiSearch({ query, filters, limit, model });
      return res.status(200).json({ 
        count: items.length, 
        items,
        searchMethod: "hybrid"
      });
    } catch (error) {
      console.error("Simple search error:", error);
      return res.status(500).json({ error: 'Search failed', details: error.message });
    }
  },

  // Dictionaries
  async getTypes(req, res) {
    const { collection = 'restaurant', city = null } = req.query || {};
    try {
      const types = await getAllTypes({ collection, city });
      return res.status(200).json(types);
    } catch (error) {
      console.error("Get types error:", error);
      return res.status(500).json({ error: 'Failed to get types' });
    }
  },

  async getNeighborhoods(req, res) {
    const { city = null } = req.query || {};
    try {
      const neighborhoods = await getAllNeighborhoods({ city });
      return res.status(200).json(neighborhoods);
    } catch (error) {
      console.error("Get neighborhoods error:", error);
      return res.status(500).json({ error: 'Failed to get neighborhoods' });
    }
  },

  // Derive types from provided items
  async getTypesFromItems(req, res) {
    const { items = [] } = req.body || {};
    try {
      const types = await getTypesFromItems(items);
      return res.status(200).json(types);
    } catch (error) {
      console.error("Get types from items error:", error);
      return res.status(500).json({ error: 'Failed to extract types' });
    }
  },
};