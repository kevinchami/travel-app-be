import Restaurant from '../models/restaurant.js';
import Cafe from '../models/cafe.js';
import Supermarket from '../models/supermarket.js';

async function searchAcrossCollections({
  queryText,
  types = ['restaurant', 'cafe', 'supermarket'],
  city,
  page = 0,
  limit = 50,
}) {
  console.log('Search parameters:', { queryText, types, city, page, limit });

  if (!queryText || typeof queryText !== 'string') {
    throw new Error('Query text is required');
  }

  // Map collection names to models
  const collectionMap = {
    restaurant: { name: 'restaurants', model: Restaurant },
    cafe: { name: 'cafes', model: Cafe },
    supermarket: { name: 'supermarkets', model: Supermarket },
  };

  // Validate and filter types
  const validTypes = types
    .map(type => type.toLowerCase().replace(/s$/, ''))
    .filter(type => Object.keys(collectionMap).includes(type));

  console.log('Valid types:', validTypes);

  if (validTypes.length === 0) {
    throw new Error('No valid collection types provided');
  }

  // Build search stage with optimized configuration
  const searchStage = {
    $search: {
      index: 'text_search',
      compound: {
        should: [
          {
            text: {
              query: queryText,
              path: 'name',
              score: { boost: { value: 5 } },
            },
          },
          {
            text: {
              query: queryText,
              path: [
                'details',
                'type',
                'address',
                'city',
                'neighborhood',
                'supervision',
              ],
              fuzzy: { maxEdits: 2 },
            },
          },
        ],
      },
    },
  };

  // Add city filter to search stage if provided
  if (city) {
    searchStage.$search.compound.filter = [
      {
        text: {
          query: city,
          path: 'city',
        },
      },
    ];
  }

  // For multiple types, search each collection separately and combine results
  const searchPromises = validTypes.map(type => {
    const Model = collectionMap[type].model;

    const pipeline = [
      searchStage,
      {
        $addFields: {
          source: type,
          score: { $meta: 'searchScore' },
        },
      },
      { $limit: limit * 2 }, // Get more results than needed for better merging
      {
        $project: {
          _id: 1,
          name: 1,
          address: 1,
          city: 1,
          neighborhood: 1,
          type: 1,
          supervision: 1,
          imageUrl: 1,
          rating: 1,
          source: 1,
          details: 1,
          contact: 1,
          mapsUrl: 1,
          openingHours: 1,
          vegan: 1,
          vegetarian: 1,
          kosherBoolean: 1,
          score: 1,
        },
      },
    ];

    console.log(
      `Searching ${type} with pipeline:`,
      JSON.stringify(pipeline, null, 2),
    );

    return Model.aggregate(pipeline)
      .option({ maxTimeMS: 30000 }) // Increase timeout to 30 seconds
      .exec()
      .then(results => {
        console.log(`Found ${results.length} results for ${type}`);
        return results;
      })
      .catch(error => {
        console.error(`Error searching ${type}:`, error);
        return []; // Return empty array on error
      });
  });

  try {
    // Execute all searches in parallel
    const allResults = await Promise.all(searchPromises);
    console.log('All results:', allResults);

    // Combine and sort results
    let combinedResults = allResults.flat();
    console.log('Combined results before sort:', combinedResults.length);

    combinedResults.sort((a, b) => (b.score || 0) - (a.score || 0));

    // Apply pagination
    const startIndex = page * limit;
    const paginatedResults = combinedResults.slice(
      startIndex,
      startIndex + limit,
    );

    console.log('Final results count:', paginatedResults.length);
    return paginatedResults;
  } catch (error) {
    console.error('Error in searchAcrossCollections:', error);
    return [];
  }
}

export { searchAcrossCollections };
