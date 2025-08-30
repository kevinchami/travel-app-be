// controllers/aiSearchController.js
import {
  unifiedSearch,
  unifiedSearchSimple,
} from '../services/aiSearch.service.js';
import Restaurant from '../models/restaurant.js';
import Cafe from '../models/cafe.js';
import Supermarket from '../models/supermarket.js';

export const aiSearchController = {
  async search(req, res, next) {
    try {
      console.log('Search request body:', req.body);
      console.log('Search request query:', req.query);

      const { q, query, types, city, cityId, limit = 20, page = 0 } = req.body;
      const searchQuery = q || query;

      if (!searchQuery || searchQuery.trim().length === 0) {
        return res.status(400).json({ error: 'Empty query', results: [] });
      }

      // Use city parameter (preferred) or fall back to cityId for backward compatibility
      const cityFilter = city || cityId;

      // Map plural types to singular for consistency
      const typesArray = (types || 'restaurant,cafe,supermarket')
        .split(',')
        .map(t => t.trim().toLowerCase())
        .map(t => t.replace(/s$/, '')) // Convert 'restaurants' to 'restaurant', etc.
        .filter(Boolean);

      console.log('Processed search parameters:', {
        searchQuery,
        typesArray,
        cityFilter,
        limit,
        page,
      });

      const results = await unifiedSearch(searchQuery, {
        types: typesArray,
        city: cityFilter,
        limit: parseInt(limit, 10),
        page: parseInt(page, 10),
      });

      console.log('Final results to send:', results);
      res.json({ ok: true, results });
    } catch (err) {
      console.error('Error in search controller:', err);
      res.status(500).json({ ok: false, error: err.message, results: [] });
    }
  },

  async searchSimple(req, res, next) {
    try {
      console.log('Simple search request body:', req.body);

      const { q, query, types, city, cityId, limit = 20, page = 0 } = req.body;
      const searchQuery = q || query;

      if (!searchQuery || searchQuery.trim().length === 0) {
        return res.status(400).json({ error: 'Empty query', results: [] });
      }

      // Use city parameter (preferred) or fall back to cityId for backward compatibility
      const cityFilter = city || cityId;

      const typesArray = (types || 'restaurant,cafe,supermarket')
        .split(',')
        .map(t => t.trim().toLowerCase())
        .map(t => t.replace(/s$/, '')) // Convert 'restaurants' to 'restaurant', etc.
        .filter(Boolean);

      const results = await unifiedSearchSimple(searchQuery, {
        types: typesArray,
        city: cityFilter,
        limit: parseInt(limit, 10),
        page: parseInt(page, 10),
      });

      res.json({ ok: true, results });
    } catch (err) {
      console.error('Error in simple search controller:', err);
      res.status(500).json({ ok: false, error: err.message, results: [] });
    }
  },

  async getTypes(req, res, next) {
    try {
      const { collection, city } = req.query;
      const models = {
        restaurant: Restaurant,
        cafe: Cafe,
        supermarket: Supermarket,
      };
      const types = [];

      const targetModels = collection
        ? [models[collection.toLowerCase().replace(/s$/, '')]] // Handle plural
        : [Restaurant, Cafe, Supermarket];

      for (const Model of targetModels) {
        if (!Model) continue;
        const pipeline = [
          ...(city ? [{ $match: { city } }] : []),
          { $unwind: { path: '$type', preserveNullAndEmptyArrays: true } },
          { $group: { _id: '$type', count: { $sum: 1 } } },
          { $match: { _id: { $ne: null } } },
          { $sort: { _id: 1 } },
        ];
        const results = await Model.aggregate(pipeline).exec();
        types.push(
          ...results.map(r => ({
            type: r._id,
            count: r.count,
            collection: Model.collection.collectionName,
          })),
        );
      }

      res.json({ ok: true, types });
    } catch (err) {
      next(err);
    }
  },

  async getNeighborhoods(req, res, next) {
    try {
      const { city } = req.query;
      const models = [Restaurant, Cafe, Supermarket];
      const neighborhoods = [];

      for (const Model of models) {
        const pipeline = [
          ...(city ? [{ $match: { city } }] : []),
          { $group: { _id: '$neighborhood', count: { $sum: 1 } } },
          { $match: { _id: { $ne: null } } },
          { $sort: { _id: 1 } },
        ];
        const results = await Model.aggregate(pipeline).exec();
        neighborhoods.push(
          ...results.map(r => ({
            neighborhood: r._id,
            count: r.count,
            collection: Model.collection.collectionName,
          })),
        );
      }

      const unique = Array.from(
        new Map(neighborhoods.map(n => [n.neighborhood, n])).values(),
      );

      res.json({ ok: true, neighborhoods: unique });
    } catch (err) {
      next(err);
    }
  },

  async getTypesFromItems(req, res, next) {
    try {
      const { items } = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'Items must be an array' });
      }

      const types = [];
      const models = {
        restaurant: Restaurant,
        cafe: Cafe,
        supermarket: Supermarket,
      };

      for (const item of items) {
        const { id, type } = item;
        const normalizedType = type?.toLowerCase().replace(/s$/, '');
        if (!id || !normalizedType || !models[normalizedType]) continue;
        const Model = models[normalizedType];
        const doc = await Model.findById(id, 'type').lean();
        if (doc && doc.type) {
          types.push(
            ...(Array.isArray(doc.type) ? doc.type : [doc.type]).map(t => ({
              type: t,
              collection: normalizedType,
            })),
          );
        }
      }

      const unique = Array.from(new Map(types.map(t => [t.type, t])).values());

      res.json({ ok: true, types: unique });
    } catch (err) {
      next(err);
    }
  },
};
