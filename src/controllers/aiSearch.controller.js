import {
  unifiedSearch,
  unifiedSearchSimple,
} from '../services/aiSearch.service.js'; // Confirm path
import Restaurant from '../models/restaurant.js';
import Cafe from '../models/cafe.js';
import Supermarket from '../models/supermarket.js';
import { CITIES } from '../constants/cities.js';
import mongoose from 'mongoose';

export const aiSearchController = {
  async search(req, res, next) {
    try {
      console.log('Request body:', req.body); // Debug
      const { query, types, city, limit = 20, page = 0 } = req.body;
      if (!query || query.trim().length === 0) {
        return res.status(400).json({ error: 'Empty query' });
      }

      const typesArray = (types || 'restaurant,cafe,supermarket')
        .split(',')
        .map(t => t.trim().toLowerCase())
        .map(t => t.replace(/s$/, ''))
        .filter(Boolean);

      const results = await unifiedSearch(query, {
        types: typesArray,
        cityId: city, // Pass city as string, service converts to ObjectId
        limit: parseInt(limit, 10),
        page: parseInt(page, 10),
      });

      res.json({ ok: true, results });
    } catch (err) {
      console.error('Search error:', err); // Debug
      next(err);
    }
  },

  async searchSimple(req, res, next) {
    try {
      console.log('Request body:', req.body); // Debug
      const { query, types, city, limit = 20, page = 0 } = req.body;
      if (!query || query.trim().length === 0) {
        return res.status(400).json({ error: 'Empty query' });
      }

      const typesArray = (types || 'restaurant,cafe,supermarket')
        .split(',')
        .map(t => t.trim().toLowerCase())
        .map(t => t.replace(/s$/, ''))
        .filter(Boolean);

      const results = await unifiedSearchSimple(query, {
        types: typesArray,
        cityId: city, // Pass city as string, service converts to ObjectId
        limit: parseInt(limit, 10),
        page: parseInt(page, 10),
      });

      res.json({ ok: true, results });
    } catch (err) {
      console.error('Simple search error:', err); // Debug
      next(err);
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
        ? [models[collection.toLowerCase().replace(/s$/, '')]]
        : [Restaurant, Cafe, Supermarket];

      for (const Model of targetModels) {
        if (!Model) continue;
        const pipeline = [
          ...(city
            ? [
                {
                  $match: {
                    city: new mongoose.Types.ObjectId(
                      CITIES[city.toUpperCase().replace(/ /g, '_')] || city,
                    ),
                  },
                },
              ]
            : []),
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
      console.error('Get types error:', err); // Debug
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
          ...(city
            ? [
                {
                  $match: {
                    city: new mongoose.Types.ObjectId(
                      CITIES[city.toUpperCase().replace(/ /g, '_')] || city,
                    ),
                  },
                },
              ]
            : []),
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
      console.error('Get neighborhoods error:', err); // Debug
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
      console.error('Get types from items error:', err); // Debug
      next(err);
    }
  },
};
