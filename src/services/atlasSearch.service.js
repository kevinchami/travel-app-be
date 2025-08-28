// src/services/atlasSearch.service.js
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
    const filter = [];

    // Get the main query text
    const text = (intent.raw || intent.query || '').trim();

    // Add text search for the main query
    if (text) {
      must.push({
        text: {
          query: text,
          path: ['name', 'type', 'details', 'supervision', 'cuisines'],
          fuzzy: { maxEdits: 2, prefixLength: 1 },
        },
      });
    }

    // Add category filter if provided
    if (intent.category) {
      filter.push({ equals: { path: 'category', value: intent.category } });
    }

    // Add types filter if provided
    if (Array.isArray(intent.types) && intent.types.length) {
      filter.push({
        in: {
          path: 'type',
          value: intent.types,
        },
      });
    }

    // Add cuisines filter if provided
    if (Array.isArray(intent.cuisines) && intent.cuisines.length) {
      should.push({
        text: {
          query: intent.cuisines.join(' '),
          path: ['cuisines', 'type', 'details'],
          fuzzy: { maxEdits: 1 },
        },
      });
    }

    // Add dietary restrictions
    if (Array.isArray(intent.diet) && intent.diet.length) {
      intent.diet.forEach(d => {
        if (d === 'kosher') {
          filter.push({ equals: { path: 'kosherBoolean', value: true } });
        } else if (d === 'vegan') {
          filter.push({ equals: { path: 'vegan', value: true } });
        } else if (d === 'vegetarian') {
          filter.push({ equals: { path: 'vegetarian', value: true } });
        } else {
          should.push({
            text: {
              query: d,
              path: ['details', 'type', 'cuisines'],
              fuzzy: { maxEdits: 1 },
            },
          });
        }
      });
    }

    // City logic:
    if (intent.cityId) {
      // Try to match documents that have cityId === intent.cityId
      filter.push({ equals: { path: 'cityId', value: intent.cityId } });
    } else if (intent.city) {
      // No ID provided - fallback to text search on the city field
      filter.push({
        text: {
          query: intent.city,
          path: 'city',
          fuzzy: { maxEdits: 1 },
        },
      });
    }

    // Add neighborhood filter if provided
    if (intent.neighborhood) {
      filter.push({
        text: {
          query: intent.neighborhood,
          path: 'neighborhood',
          fuzzy: { maxEdits: 1 },
        },
      });
    }

    // Add additional filters
    if (intent.filters) {
      if (intent.filters.kosherBoolean === true)
        filter.push({ equals: { path: 'kosherBoolean', value: true } });
      if (intent.filters.highlighted === true)
        filter.push({ equals: { path: 'highlighted', value: true } });
      if (intent.filters.vegan === true)
        filter.push({ equals: { path: 'vegan', value: true } });
      if (intent.filters.vegetarian === true)
        filter.push({ equals: { path: 'vegetarian', value: true } });
      if (intent.filters.discount === true)
        filter.push({ equals: { path: 'discount', value: true } });
      if (intent.filters.bookingNeeded === true)
        filter.push({ equals: { path: 'bookingNeeded', value: true } });
      if (intent.filters.ratingMin)
        filter.push({
          range: { path: 'rating', gte: intent.filters.ratingMin },
        });
      if (intent.filters.priceLevel)
        filter.push({
          equals: { path: 'priceLevel', value: intent.filters.priceLevel },
        });
      if (intent.filters.supervision)
        filter.push({
          text: { query: intent.filters.supervision, path: 'supervision' },
        });
    }

    // Build the compound operator
    const compound = { compound: {} };
    if (must.length) compound.compound.must = must;
    if (should.length) compound.compound.should = should;
    if (filter.length) compound.compound.filter = filter;

    // If no clauses, use a match-all
    if (!must.length && !should.length && !filter.length) {
      compound.compound.must = [{ exists: { path: '_id' } }];
    }

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
          totalReviews: 1,
          type: 1,
          details: 1,
          city: 1,
          cityId: 1,
          neighborhood: 1,
          kosherBoolean: 1,
          vegan: 1,
          vegetarian: 1,
          highlighted: 1,
          imageUrl: 1,
          location: 1,
          supervision: 1,
          priceLevel: 1,
          discount: 1,
          bookingNeeded: 1,
          openingHours: 1,
          mapsUrl: 1,
          contact: 1,
          cuisines: 1,
        },
      },
      { $limit: top_k },
    ];

    try {
      const raw = await model.aggregate(pipeline).allowDiskUse(true);
      return raw.map(r => ({
        ...r,
        _id: r._id?.toString?.() || r._id,
        collection: model.collection.collectionName,
        searchScore: r.searchScore || 0,
      }));
    } catch (err) {
      console.error(`Atlas search failed for ${model.modelName}:`, err);
      throw err;
    }
  }

  async search(intent, top_k = 10) {
    if (!ATLAS_ENABLED) {
      console.log('Atlas Search is disabled');
      return [];
    }

    const targetCollections = intent.category
      ? { [intent.category]: this.collections[intent.category] }
      : this.collections;

    const results = [];
    for (const [name, model] of Object.entries(targetCollections)) {
      if (!model) continue;
      try {
        console.log(`Searching in ${name} collection...`);
        const items = await this.runAtlasSearchForModel(model, intent, top_k);
        console.log(`Found ${items.length} results in ${name}`);
        results.push(...items);
      } catch (err) {
        console.error(`Atlas search failed for ${name}:`, err.message || err);
      }
    }

    return results;
  }
}

export const atlasSearchService = new AtlasSearchService();
