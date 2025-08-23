import dotenv from 'dotenv';
import { aiParseQuery } from './aiParsing.service.js';
import { atlasSearchService } from './atlasSearch.service.js';
import { searchInMongoDB, simpleSearchInMongoDB } from './search.service.js';
import { collections } from '../models/index.js';

dotenv.config();

const ATLAS_ENABLED = process.env.ATLAS_SEARCH_ENABLED === 'true' || false;

export const aiSearchOrchestrator = async (intentOrText, top_k = 10) => {
  const intent = typeof intentOrText === 'string' ? await aiParseQuery(intentOrText) : intentOrText;
  const requestedTop = intent.top_n || top_k || 10;
  const targetCollections = intent.category ? { [intent.category]: collections[intent.category] } : collections;
  const results = [];

  // Try Atlas Search first
  if (ATLAS_ENABLED) {
    for (const [name, model] of Object.entries(targetCollections)) {
      if (!model) continue;
      try {
        const items = await atlasSearchService.runAtlasSearchForModel(model, intent, requestedTop);
        items.forEach((it) => results.push(it));
      } catch (err) {
        console.warn(`Atlas search failed for ${name}:`, err.message || err);
      }
    }
  }

  // Fallback to MongoDB search if Atlas didn't return results
  if (!results.length) {
    try {
      const fallback = await searchInMongoDB(intent.raw || intent.query || intent, requestedTop);
      fallback.forEach((f) => results.push({ ...f, searchScore: f.searchScore || 0 }));
    } catch (err) {
      console.warn('Fallback searchInMongoDB failed:', err.message || err);
    }
  }

  // Deduplicate and rank results
  const map = new Map();
  for (const r of results) {
    const key = r._id?.toString?.() || r._id;
    if (!map.has(key)) {
      map.set(key, r);
    } else {
      const existing = map.get(key);
      if ((r.searchScore || 0) > (existing.searchScore || 0)) {
        map.set(key, r);
      }
    }
  }

  const merged = Array.from(map.values());
  const ranked = merged.sort((a, b) => {
    const scoreA = (a.searchScore || 0) * 3 + (a.rating || 0) * 2 + (a.reviewsCount || 0) * 0.01;
    const scoreB = (b.searchScore || 0) * 3 + (b.rating || 0) * 2 + (b.reviewsCount || 0) * 0.01;
    return scoreB - scoreA;
  });

  return ranked.slice(0, requestedTop);
};

export const simpleAiSearch = async ({ query = '', filters = {}, limit = 50, model = null }) => {
  const hasQuery = query && query.trim().length > 0;
  if (!hasQuery && (!filters || Object.keys(filters).length === 0)) return [];

  if (!ATLAS_ENABLED) return simpleSearchInMongoDB(query, filters, limit, model);

  const lightweightIntent = { 
    raw: query, 
    filters, 
    category: model || null,
    top_n: limit
  };

  const collectionsToSearch = model ? { [model]: collections[model] } : collections;
  let results = [];

  for (const [name, collModel] of Object.entries(collectionsToSearch)) {
    try {
      const items = await atlasSearchService.runAtlasSearchForModel(collModel, lightweightIntent, limit);
      items.forEach((it) => results.push(it));
    } catch (err) {
      console.warn('simpleAiSearch atlas run failed for', name, ':', err.message || err);
      const fallback = await simpleSearchInMongoDB(query, filters, limit, name);
      fallback.forEach((f) => results.push({ ...f, searchScore: f.searchScore || 0 }));
    }
  }

  // Deduplicate and rank
  const map = new Map();
  for (const r of results) {
    const key = r._id?.toString?.() || r._id;
    if (!map.has(key)) {
      map.set(key, r);
    } else {
      const existing = map.get(key);
      if ((r.searchScore || 0) > (existing.searchScore || 0)) {
        map.set(key, r);
      }
    }
  }

  const merged = Array.from(map.values()).sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
  return merged.slice(0, limit);
};

export const getAllTypes = async ({ collection = 'restaurant', city = null }) => {
  const model = collections[collection];
  if (!model) throw new Error(`Invalid collection ${collection}`);
  const query = city ? { city } : {};
  return model.distinct('type', query);
};

export const getAllNeighborhoods = async ({ city = null }) => {
  const neighborhoods = new Set();
  const candidates = [collections.restaurant, collections.cafe];
  for (const model of candidates) {
    const docs = await model.distinct('neighborhood', city ? { city } : {});
    docs.forEach((d) => d && neighborhoods.add(d));
  }
  return Array.from(neighborhoods).sort();
};

export const getTypesFromItems = (items = []) => {
  const rawTypesArray = items.map((i) => i.type).filter(Boolean);
  const set = new Set();
  rawTypesArray.forEach((t) => {
    t.split(',').map((s) => s.trim()).filter(Boolean).forEach((s) => set.add(s));
  });
  return Array.from(set).sort();
};