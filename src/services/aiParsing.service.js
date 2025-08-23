import dotenv from 'dotenv';
import OpenAI from 'openai';
import { extractCityFromQuery } from '../utils/extractCityFromQuery.js';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Parse a natural-language query into a stable JSON intent object.
 * Returns a predictable shape even on fallback.
 */
export const aiParseQuery = async (query) => {
  if (!query || !query.trim()) {
    return {
      category: null,
      types: null,
      cuisines: null,
      diet: null,
      city: null,
      neighborhood: null,
      filters: null,
      top_n: 10,
      raw: '',
    };
  }

  const prompt = `You are a JSON generator that turns a user's search for places (restaurants, cafes, supermarkets, tours, parties, temples, accommodations, etc.) into a single JSON object with the following fields when applicable:
{
  "category": "restaurant|cafe|supermarket|party|tour|temple|accommodation|must|null",
  "types": ["fast food", "steakhouse"],
  "cuisines": ["meat", "italian"],
  "diet": ["kosher", "vegan"],
  "city": "Paris",
  "neighborhood": "Le Marais",
  "filters": {"rating": "4+", "highlighted": true},
  "top_n": 10,
  "raw": "<short normalized user text>"
}
Return only valid JSON. Use null for unknown fields. Example input: "I want to eat meat kosher in Paris, show best rated 5 results". Now parse this query: "${query}"`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_PARSER_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0,
      max_tokens: 300,
    });

    const content = response?.choices?.[0]?.message?.content || '';
    let parsed = null;
    
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      // Try to extract a JSON substring
      const jsonMatch = content.match(/\{[\s\S]*\}$/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    }

    parsed = parsed || {};
    parsed.raw = parsed.raw || query;
    
    // Extract city if not provided
    if ((!parsed.city || parsed.city === null) && typeof query === 'string') {
      const detectedCity = extractCityFromQuery(query);
      if (detectedCity) parsed.city = detectedCity;
    }
    
    // Ensure top_n is a number
    if (parsed.top_n && typeof parsed.top_n === 'string') {
      const asNum = parseInt(parsed.top_n, 10);
      parsed.top_n = Number.isFinite(asNum) ? asNum : 10;
    }
    
    // Ensure minimal shape
    return {
      category: parsed.category ?? null,
      types: parsed.types ?? null,
      cuisines: parsed.cuisines ?? null,
      diet: parsed.diet ?? null,
      city: parsed.city ?? null,
      neighborhood: parsed.neighborhood ?? null,
      filters: parsed.filters ?? null,
      top_n: parsed.top_n ?? 10,
      raw: parsed.raw ?? query,
    };
  } catch (err) {
    console.warn('aiParseQuery failed, falling back to heuristics:', err?.message || err);
    return {
      category: null,
      types: null,
      cuisines: null,
      diet: null,
      city: extractCityFromQuery(query) || null,
      neighborhood: null,
      filters: null,
      top_n: 10,
      raw: query,
    };
  }
};