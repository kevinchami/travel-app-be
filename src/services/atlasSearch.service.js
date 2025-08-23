import dotenv from 'dotenv';
import { collections } from '../models/index.js';

dotenv.config();

const ATLAS_ENABLED = process.env.ATLAS_SEARCH_ENABLED === 'true' || false;

export class AtlasSearchService {
  constructor() {
    this.collections = collections;
  }

  buildAtlasSearchStage(intent) {
    const must = [];
    const should = [];
    const text = (intent.raw || intent.query || '').trim();

    if (text) {
      must.push({
        text: {
          query: text,
          path: ['name', 'type', 'cuisines', 'details'],
          fuzzy: { maxEdits: 2, prefixLength: 1 },
        },
      });
    }

    if (intent.category) {
      must.push({ text: { query: intent.category, path: ['type', 'tags'] } });
    }

    if (Array.isArray(intent.cuisines) && intent.cuisines.length) {
      intent.cuisines.forEach((c) =>
        should.push({ text: { query: c, path: ['cuisines', 'details'], fuzzy: { maxEdits: 1 } } }),
      );
    }

    if (Array.isArray(intent.diet) && intent.diet.length) {
      intent.diet.forEach((d) =>
        should.push({ text: { query: d, path: ['details', 'diet'], fuzzy: { maxEdits: 1 } } }),
      );
    }

    if (intent.city) {
      must.push({ text: { query: intent.city, path: ['cityName', 'address.city', 'city'], fuzzy: { maxEdits: 1 } } });
    }

    const compound = { compound: {} };
    if (must.length) compound.compound.must = must;
    if (should.length) compound.compound.should = should;

    const filters = [];
    if (intent.filters) {
      if (intent.filters.kosherBoolean === true) filters.push({ equals: { path: 'kosherBoolean', value: true } });
      if (intent.filters.highlighted === true) filters.push({ equals: { path: 'highlighted', value: true } });
      if (intent.filters.ratingMin) filters.push({ range: { path: 'rating', gte: intent.filters.ratingMin } });
    }

    if (filters.length) compound.compound.filter = { compound: { must: filters } };

    return { $search: compound };
  }

  async runAtlasSearchForModel(model, intent, top_k = 10) {
    const searchStage = this.buildAtlasSearchStage(intent);
    const pipeline = [
      searchStage,
      { $addFields: { searchScore: { $meta: 'searchScore' } } },
      {
        $project: {
          searchScore: 1,
          name: 1,
          rating: 1,
          reviewsCount: 1,
          type: 1,
          cuisines: 1,
          details: 1,
          city: 1,
          neighborhood: 1,
          kosherBoolean: 1,
          highlighted: 1,
          imageUrl: 1,
          location: 1,
        },
      },
      { $limit: top_k },
    ];

    try {
      const raw = await model.aggregate(pipeline).allowDiskUse(true);
      return raw.map((r) => ({
        ...r,
        _id: r._id?.toString?.() || r._id,
        collection: model.collection.collectionName,
        searchScore: r.searchScore || 0,
      }));
    } catch (err) {
      throw err;
    }
  }

  async search(intent, top_k = 10) {
    if (!ATLAS_ENABLED) return [];

    const targetCollections = intent.category 
        ? { [intent.category]: this.collections[intent.category] } 
        : this.collections;

    const results = [];

    for (const [name, model] of Object.entries(targetCollections)) {
      if (!model) continue;
      try {
        const items = await this.runAtlasSearchForModel(model, intent, top_k);
        items.forEach((it) => results.push(it));
      } catch (err) {
        console.warn(`Atlas search failed for ${name}:`, err.message || err);
      }
    }

    return results;
  }
}

export const atlasSearchService = new AtlasSearchService();