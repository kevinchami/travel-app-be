import { CITIES_LIST } from '../constants/cities.js';

// ... (getClassificationPrompt remains the same) ...
const VALID_CATEGORIES = [
  'restaurant',
  'cafe',
  'supermarket',
  'party',
  'tour',
  'temple',
  'accommodation',
  'must',
];

export const getClassificationPrompt = query => {
  return `You are a classification system. Your only job is to identify the primary category of a user's search query for places.
  The valid categories are: ${VALID_CATEGORIES.join(', ')}.
  If no specific category fits, return "null".
  Return only the single category name as a JSON string.

  Example 1: "kosher pizza in paris" -> "restaurant"
  Example 2: "supermarkets near me" -> "supermarket"
  Example 3: "best coffee shops in london" -> "cafe"
  Example 4: "what to do in nyc" -> "must"

  Now, classify this query: "${query}"`;
};

// A simple list of cities to inject into the prompt.
const cityListForPrompt = CITIES_LIST.map(c => `${c.name} (id: ${c.id})`).join(
  ', ',
);

/**
 * Generates a detailed extraction prompt based on the detected category.
 */
export const getExtractionPrompt = (query, category) => {
  // NOTE: The base schema NO LONGER includes a "city" field. Only "cityId".
  const baseSchema = {
    cityId: '68698853480ffd5b4bb1c51f', // The corresponding ID from the provided list
    neighborhood: 'Le Marais',
    filters: {
      ratingMin: 4,
      priceLevel: 1, // 1: budget, 2: moderate, 3: expensive
      highlighted: true,
      discount: true,
      bookingNeeded: true,
    },
    top_n: 10,
    raw: '<short normalized user text>',
  };

  let categorySpecificSchema = {};

  switch (category) {
    case 'restaurant':
      categorySpecificSchema = {
        category: 'restaurant',
        types: ['fast food', 'steakhouse', 'bakery'],
        cuisines: ['meat', 'italian', 'dairy'],
        diet: ['kosher', 'vegan', 'vegetarian'],
        filters: {
          ...baseSchema.filters,
          kosherBoolean: true,
          vegan: true,
          vegetarian: true,
          supervision: 'badatz',
        },
      };
      break;
    // ... other cases for cafe, supermarket remain the same ...
    default:
      categorySpecificSchema = {
        category: category || null,
        types: ['type1', 'type2'],
      };
      break;
  }

  const finalSchema = { ...baseSchema, ...categorySpecificSchema };
  finalSchema.filters = {
    ...baseSchema.filters,
    ...(categorySpecificSchema.filters || {}),
  };

  return `You are a JSON generator that turns a user's search for places into a single JSON object.
The user is searching for the category: "${category}".
Use the following JSON schema. Use null for unknown fields.

Schema:
${JSON.stringify(finalSchema, null, 2)}

IMPORTANT: When you identify a city from the list, you MUST provide its corresponding 'cityId'. Do NOT include a 'city' name field in the JSON output.
Valid Cities: [${cityListForPrompt}]

Return only the valid JSON object.

Example input: "I want to eat meat kosher in New York, show best rated 5 results"
Example output for 'restaurant' category:
{
  "cityId": "68698853480ffd5b4bb1c51f",
  "neighborhood": null,
  "filters": {
    "ratingMin": 4,
    "priceLevel": null,
    "highlighted": null,
    "discount": null,
    "bookingNeeded": null,
    "kosherBoolean": true,
    "vegan": null,
    "vegetarian": null,
    "supervision": null
  },
  "top_n": 5,
  "raw": "best rated 5 kosher meat in New York",
  "category": "restaurant",
  "types": null,
  "cuisines": ["meat"],
  "diet": ["kosher"]
}

Now, parse this query: "${query}"`;
};
