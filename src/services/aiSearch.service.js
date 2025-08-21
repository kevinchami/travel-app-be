// This module orchestrates the AI search across collections.
// It calls per-collection services and merges results.
// Replace internals with MongoDB Atlas Search or your Mongo queries later.

import { searchRestaurants } from './restaurant.service.js';
import { searchCafes } from './cafe.service.js';
import { searchParties } from './party.service.js';

function uniqById(items) {
  const seen = new Set();
  const out = [];
  for (const it of items) {
    const id = String(it._id || it.id || '');
    if (!seen.has(id)) {
      seen.add(id);
      out.push(it);
    }
  }
  return out;
}

export async function aiSearchOrchestrator(intent, topK = 10) {
  // Dispatch by category first, but you can expand to multiple collections if category is null.
  const tasks = [];

  if (!intent.category || intent.category === 'restaurant') {
    tasks.push(searchRestaurants({ intent, limit: topK }));
  }
  if (!intent.category || intent.category === 'cafe') {
    tasks.push(searchCafes({ intent, limit: topK }));
  }
  if (!intent.category || intent.category === 'party') {
    tasks.push(searchParties({ intent, limit: topK }));
  }

  const all = (await Promise.all(tasks)).flat();
  // You can add a ranking function here, eg: searchScore desc, rating desc, totalReviews desc
  const unique = uniqById(all);
  return unique.slice(0, topK);
}

export async function simpleAiSearch({ query, filters, limit = 50, model = null }) {
  // This is a thin wrapper. You may want to:
  // 1) aiParseQuery(query) to extract city, cuisines, diet
  // 2) translate filters into $match
  // 3) call the best matching collection service
  // For now, we return an empty array to keep the contract.
  return [];
}

export async function getAllTypes({ collection = 'restaurant', city = null }) {
  // TODO: aggregate distinct types from the target collection, optionally filtered by city
  // Return a dummy consistent shape for now.
  return [
    { type: 'Pizza', count: 120 },
    { type: 'Meat', count: 75 },
    { type: 'Sushi', count: 64 },
  ];
}

export async function getAllNeighborhoods({ city = null }) {
  // TODO: aggregate distinct neighborhoods, optionally by city
  return [
    { neighborhood: 'Center', count: 88 },
    { neighborhood: 'Downtown', count: 67 },
    { neighborhood: 'Beach', count: 21 },
  ];
}

export async function getTypesFromItems(items = []) {
  // Extract unique 'type' tokens from provided items
  const set = new Set();
  for (const it of items) {
    const t = Array.isArray(it?.type) ? it.type : String(it?.type || '');
    const parts = Array.isArray(t) ? t : t.split(',').map(s => s.trim()).filter(Boolean);
    for (const p of parts) set.add(p);
  }
  return Array.from(set).sort();
}
