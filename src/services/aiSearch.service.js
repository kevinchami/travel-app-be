import { OpenAI } from 'openai';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Restaurant from '../models/restaurant.js';
import Cafe from '../models/cafe.js';
import Supermarket from '../models/supermarket.js';
import { CITIES } from '../constants/cities.js';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Model map for dynamic querying
const modelMap = {
  restaurant: Restaurant,
  cafe: Cafe,
  supermarket: Supermarket,
};

// Get schema objects for prompting
const restaurantSchema = Restaurant.schema.obj;
const cafeSchema = Cafe.schema.obj;
const supermarketSchema = Supermarket.schema.obj;

// Map city names to ObjectIds
const cityNameToId = Object.keys(CITIES).reduce((acc, key) => {
  acc[key.toLowerCase().replace(/_/g, ' ')] = CITIES[key];
  return acc;
}, {});

/**
 * Generate MongoDB query parameters using OpenAI based on user input.
 * @param {string} userInput - The free-text search input from the user.
 * @param {object} opts - Additional options like cityId, types.
 * @returns {object} - { types, query, sort, limit }
 */
async function generateMongoQuery(userInput, opts = {}) {
  const { cityId, types: optTypes } = opts;

  const prompt = `
You are a MongoDB query generator for searching restaurants, cafes, and supermarkets.
User input: "${userInput}"

Additional filters:
${cityId ? `- City: "${cityId}" (use the provided cityId as a MongoDB ObjectId in the query for the 'city' field)` : '- City: If a city name is mentioned (e.g., "Miami"), map it to a MongoDB ObjectId using the provided city mapping.'}

City mapping (use these ObjectIds for the 'city' field):
${Object.keys(CITIES)
  .map(
    key => `${key.toLowerCase().replace(/_/g, ' ')}: ${CITIES[key].toString()}`,
  )
  .join('\n')}

Schemas:
- Restaurant: ${JSON.stringify({ ...restaurantSchema, city: { type: 'ObjectId', ref: 'City' } }, null, 2)}
- Cafe: ${JSON.stringify({ ...cafeSchema, city: { type: 'ObjectId', ref: 'City' } }, null, 2)}
- Supermarket: ${JSON.stringify({ ...supermarketSchema, city: { type: 'ObjectId', ref: 'City' } }, null, 2)}

Generate a JSON object with:
- types: array of collection types to search (possible: ["restaurant", "cafe", "supermarket"]). Choose based on user intent (e.g., "restaurants" → ["restaurant"]). Respect optTypes if provided.
- query: MongoDB find query object (e.g., { kosherBoolean: true, city: "ObjectId('68676a6e480ffd5b4bb1c516')", type: { $in: ["meat"] }, rating: { $gte: 4.0 } }). Use schema fields. Support:
  - Partial text matches with { $regex: "text", $options: "i" } for strings (e.g., name, details).
  - Boolean matches (e.g., kosherBoolean: true).
  - Array matches with { $in: [...] } for type field.
  - Numeric comparisons with $gte, $lte for rating, priceLevel, etc.
  - City as an ObjectId (e.g., "ObjectId('68676a6e480ffd5b4bb1c516')" for Miami).
- sort: sort object (e.g., { rating: -1 } for descending). Default to { updatedAt: -1 } if unclear.
- limit: number (default 50, max 100).

Match user intent precisely. Use $regex for text, $in for arrays, $gte/$lte for numbers, and ObjectId for city. If no specific filters, return {} for query.
Output ONLY the JSON object as a plain string, without markdown, code blocks (e.g., \`\`\`json), or any other text.
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.2,
    });

    let jsonString = response.choices[0].message.content.trim();
    console.log('Raw OpenAI response:', jsonString); // Debug

    // Strip markdown code blocks if present
    jsonString = jsonString.replace(/^```json\n|\n```$/g, '').trim();

    const parsed = JSON.parse(jsonString);

    if (
      !Array.isArray(parsed.types) ||
      typeof parsed.query !== 'object' ||
      typeof parsed.sort !== 'object' ||
      typeof parsed.limit !== 'number'
    ) {
      throw new Error('Invalid JSON structure from OpenAI');
    }

    // Convert city string to ObjectId if needed
    if (
      parsed.query.city &&
      typeof parsed.query.city === 'string' &&
      !parsed.query.city.startsWith('ObjectId')
    ) {
      const cityName = parsed.query.city.toLowerCase().replace(/_/g, ' ');
      const cityIdFromMap = cityNameToId[cityName];
      if (cityIdFromMap) {
        parsed.query.city = cityIdFromMap.toString();
      } else if (mongoose.Types.ObjectId.isValid(parsed.query.city)) {
        parsed.query.city = parsed.query.city;
      } else {
        throw new Error(`Invalid city: ${parsed.query.city}`);
      }
    }

    return parsed;
  } catch (err) {
    console.error('OpenAI error:', err);
    console.error('Failed JSON string:', jsonString);
    throw new Error(`Failed to generate query with OpenAI: ${err.message}`);
  }
}

/**
 * Execute find queries across specified collections.
 * @param {object} mongoParams - { types, query, sort, limit } from OpenAI
 * @param {object} opts - Override options (e.g., types, cityId, limit, page)
 * @returns {array} - Array of full documents with source added
 */
async function executeQueries(mongoParams, opts = {}) {
  let { types, query, sort, limit } = mongoParams;
  const { page = 0, cityId, types: optTypes } = opts;

  // Override with opts if provided
  if (optTypes) {
    types = optTypes.filter(t => Object.keys(modelMap).includes(t));
  }
  if (opts.limit) limit = opts.limit;
  if (cityId) {
    const cityName = cityId.toLowerCase().replace(/_/g, ' ');
    const cityObjectId =
      cityNameToId[cityName] ||
      (mongoose.Types.ObjectId.isValid(cityId) ? cityId : null);
    if (!cityObjectId) throw new Error(`Invalid cityId: ${cityId}`);
    query = { ...query, city: new mongoose.Types.ObjectId(cityObjectId) };
  } else if (query.city && typeof query.city === 'string') {
    query = {
      ...query,
      city: new mongoose.Types.ObjectId(
        query.city.replace(/^ObjectId\(['"]|['"]\)$/g, ''),
      ),
    };
  }

  const results = [];
  const skip = page * limit;

  for (const type of types) {
    const Model = modelMap[type];
    if (!Model) continue;

    console.log('Executing query:', { type, query, sort, limit, skip }); // Debug
    const q = Model.find(query)
      .sort(sort || { updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const docs = await q.exec();
    console.log(`Found ${docs.length} documents for ${type}`); // Debug
    results.push(...docs.map(doc => ({ ...doc, source: type })));
  }

  // Sort combined results by rating (descending)
  results.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return results;
}

/**
 * Unified search using OpenAI to generate query.
 * @param {string} userInput
 * @param {object} opts - { types, cityId, limit, page }
 */
export async function unifiedSearch(userInput, opts = {}) {
  const mongoParams = await generateMongoQuery(userInput, opts);
  return executeQueries(mongoParams, opts);
}

/**
 * Simple search (no OpenAI, basic text search with regex on name/details)
 * @param {string} userInput
 * @param {object} opts - { types, cityId, limit, page }
 */
export async function unifiedSearchSimple(userInput, opts = {}) {
  const {
    types = ['restaurant', 'cafe', 'supermarket'],
    cityId,
    limit = 20,
    page = 0,
  } = opts;

  const query = {
    $or: [
      { name: { $regex: userInput, $options: 'i' } },
      { details: { $regex: userInput, $options: 'i' } },
      { personalOpinion: { $regex: userInput, $options: 'i' } },
    ],
  };
  if (cityId) {
    const cityName = cityId.toLowerCase().replace(/_/g, ' ');
    const cityObjectId =
      cityNameToId[cityName] ||
      (mongoose.Types.ObjectId.isValid(cityId) ? cityId : null);
    if (!cityObjectId) throw new Error(`Invalid cityId: ${cityId}`);
    query.city = new mongoose.Types.ObjectId(cityObjectId);
  }

  return executeQueries({ types, query, sort: { rating: -1 }, limit }, opts);
}
