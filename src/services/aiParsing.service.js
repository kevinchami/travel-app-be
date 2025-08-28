// src/services/aiParsing.service.js
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { extractCityFromQuery } from '../utils/extractCityFromQuery.js';
import { getCityIdByName } from '../utils/cityMapper.js';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Parse a natural-language query into a stable JSON intent object.
 * Returns a predictable shape even on fallback.
 */
export const aiParseQuery = async query => {
  if (!query || !query.trim()) {
    return {
      category: null,
      types: null,
      cuisines: null,
      diet: null,
      city: null,
      cityId: null,
      neighborhood: null,
      filters: null,
      top_n: 10,
      raw: '',
    };
  }

  const prompt = `You are a JSON generator that turns a user's search for places (restaurants, cafes, supermarkets, tours, parties, temples, accommodations, etc.) into a single JSON object with the following fields when applicable:
{
  "category": "restaurant|cafe|supermarket|party|tour|temple|accommodation|null",
  "types": ["fast food", "steakhouse", "bakery"] | null,
  "cuisines": ["meat", "italian", "dairy"] | null,
  "diet": ["kosher", "vegan", "vegetarian"] | null,
  "city": "Paris or null (human readable)",
  "cityId": "canonical-city-id-from-our-constants-or-null",
  "neighborhood": "Le Marais or null",
  "filters": {
    "ratingMin": 4,
    "priceLevel": 1,
    "highlighted": true,
    "kosherBoolean": true,
    "vegan": true,
    "vegetarian": true,
    "discount": true,
    "bookingNeeded": true,
    "supervision": "badatz"
  } | null,
  "top_n": 10,
  "raw": "<short normalized user text>"
}
Return only valid JSON, no explanation. Use null for unknown fields.

Now parse this query: "${query}"`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_PARSER_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0,
      max_tokens: 500,
    });

    // content can contain extra text; try robust JSON extraction
    const content = response?.choices?.[0]?.message?.content || '';
    let parsed = null;

    // first try direct parse
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      // extract the first top-level JSON object in the output
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch (err2) {
          parsed = {};
        }
      } else {
        parsed = {};
      }
    }

    parsed = parsed || {};
    parsed.raw = parsed.raw || query;

    // If parser returned a city string but not a cityId, try to convert
    if (
      (!parsed.cityId || parsed.cityId === null) &&
      parsed.city &&
      typeof parsed.city === 'string'
    ) {
      const possibleId = getCityIdByName(parsed.city);
      if (possibleId) parsed.cityId = possibleId;
      // if parsed.city already looks like an id in your cities constant, keep it
      else if (
        typeof parsed.city === 'string' &&
        parsed.city.match(/^[A-Z0-9_-]+$/i)
      ) {
        // assume client may have sent an id in city field
        parsed.cityId = parsed.city;
      }
    }

    // If still missing, try heuristic city detection from query string
    if (
      (!parsed.cityId || parsed.cityId === null) &&
      (!parsed.city || parsed.city === null)
    ) {
      const detectedCity = extractCityFromQuery(query);
      if (detectedCity) {
        parsed.city = detectedCity;
        const id = getCityIdByName(detectedCity);
        if (id) parsed.cityId = id;
      }
    }

    // Normalize arrays
    const ensureArray = v => {
      if (!v) return null;
      if (Array.isArray(v)) return v.length ? v : null;
      if (typeof v === 'string') {
        const arr = v
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        return arr.length ? arr : null;
      }
      return [v];
    };

    parsed.types = ensureArray(parsed.types);
    parsed.cuisines = ensureArray(parsed.cuisines);
    parsed.diet = ensureArray(parsed.diet);

    // Treat some common filter forms -> ratingMin
    if (parsed.filters && typeof parsed.filters === 'object') {
      // handle "rating" or "ratingMin" text forms
      if (parsed.filters.rating && typeof parsed.filters.rating === 'string') {
        const txt = parsed.filters.rating.toLowerCase();
        if (txt.includes('4.5')) parsed.filters.ratingMin = 4.5;
        else if (txt.includes('4')) parsed.filters.ratingMin = 4;
        else if (txt.includes('5')) parsed.filters.ratingMin = 5;
        delete parsed.filters.rating;
      }
    }

    // Coerce top_n
    if (parsed.top_n && typeof parsed.top_n === 'string') {
      const n = parseInt(parsed.top_n, 10);
      parsed.top_n = Number.isFinite(n) ? n : 10;
    }

    // Final normalized object
    return {
      category: parsed.category ?? null,
      types: parsed.types ?? null,
      cuisines: parsed.cuisines ?? null,
      diet: parsed.diet ?? null,
      city: parsed.city ?? null,
      cityId: parsed.cityId ?? null,
      neighborhood: parsed.neighborhood ?? null,
      filters: parsed.filters ?? null,
      top_n: parsed.top_n ?? 10,
      raw: parsed.raw ?? query,
    };
  } catch (err) {
    console.warn(
      'aiParseQuery failed, falling back to heuristics:',
      err?.message || err,
    );
    const detectedCity = extractCityFromQuery(query);
    const cityId = detectedCity ? getCityIdByName(detectedCity) : null;

    return {
      category: null,
      types: null,
      cuisines: null,
      diet: null,
      city: detectedCity || null,
      cityId: cityId,
      neighborhood: null,
      filters: null,
      top_n: 10,
      raw: query,
    };
  }
};
