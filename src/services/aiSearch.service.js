import { searchAcrossCollections } from './atlasSearch.service.js';

// Simple placeholder for LLM parsing
async function parseQueryWithLLM(queryText) {
  console.log('LLM parsing query:', queryText);
  // In a real implementation, you would call an LLM API here
  return { keywords: queryText };
}

export async function unifiedSearch(q, opts = {}) {
  console.log('unifiedSearch called with:', q, opts);

  const {
    types = ['restaurant', 'cafe', 'supermarket'],
    city,
    limit = 20,
    page = 0,
  } = opts;

  try {
    // Parse query with LLM (for /search route)
    const { keywords } = await parseQueryWithLLM(q);
    console.log('Keywords after LLM parsing:', keywords);

    // Run Atlas Search
    const results = await searchAcrossCollections({
      queryText: keywords,
      types,
      city,
      page,
      limit,
    });

    console.log('Raw results from search:', results);

    // Apply type-specific boosts for better ranking
    const typeBoost = {
      restaurant: 1.0,
      cafe: 0.95,
      supermarket: 0.9,
    };

    if (results.length > 0) {
      const maxScore = Math.max(...results.map(r => r.score || 0));
      results.forEach(r => {
        const normalized = maxScore > 0 ? r.score / maxScore : 0;
        const boost = typeBoost[r.source] || 1.0;
        r.combinedScore = normalized * boost;
      });

      // Resort by combined score
      results.sort((a, b) => b.combinedScore - a.combinedScore);
    }

    // Map to unified shape
    const mappedResults = results.map(r => ({
      id: r._id,
      name: r.name,
      description: r.details || r.personalOpinion || '',
      city: r.city || '',
      address: r.address || '',
      type: r.source,
      score: r.combinedScore || 0,
      textScore: r.score || 0,
      rating: r.rating || 0,
      tags: Array.isArray(r.type) ? r.type : [r.type].filter(Boolean),
      cuisine:
        r.source === 'restaurant'
          ? Array.isArray(r.type)
            ? r.type
            : [r.type].filter(Boolean)
          : [],
      imageUrl: r.imageUrl || [],
      supervision: r.supervision || '',
      kosherBoolean: r.kosherBoolean || false,
      vegan: r.vegan || false,
      vegetarian: r.vegetarian || false,
    }));

    console.log('Mapped results:', mappedResults);
    return mappedResults;
  } catch (error) {
    console.error('Error in unifiedSearch:', error);
    return [];
  }
}

export async function unifiedSearchSimple(q, opts = {}) {
  console.log('unifiedSearchSimple called with:', q, opts);
  // Skip LLM parsing for simple search
  return unifiedSearch(q, opts);
}
