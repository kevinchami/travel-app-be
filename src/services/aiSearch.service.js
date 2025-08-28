// services/searchService.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AiSearchService {
  constructor() {
    this.defaultLimit = 20;
    this.maxLimit = 100;
    this.vectorWeight = 0.6;
    this.textWeight = 0.4;

    // Bind all methods to preserve 'this' context
    this.parseAdvancedQuery = this.parseAdvancedQuery.bind(this);
    this.fallbackParsing = this.fallbackParsing.bind(this);
    this.generateContextualEmbedding =
      this.generateContextualEmbedding.bind(this);
    this.buildContextualQuery = this.buildContextualQuery.bind(this);
    this.hybridSearch = this.hybridSearch.bind(this);
    this.buildVectorSearchPipeline = this.buildVectorSearchPipeline.bind(this);
    this.buildTextSearchPipeline = this.buildTextSearchPipeline.bind(this);
    this.buildHybridSearchPipeline = this.buildHybridSearchPipeline.bind(this);
    this.buildTextSearchQueries = this.buildTextSearchQueries.bind(this);
    this.buildVectorFilters = this.buildVectorFilters.bind(this);
    this.buildTextSearchFilters = this.buildTextSearchFilters.bind(this);
    this.buildPostProcessingPipeline =
      this.buildPostProcessingPipeline.bind(this);
    this.buildSortStage = this.buildSortStage.bind(this);
    this.getSearchSuggestions = this.getSearchSuggestions.bind(this);
    this.analyzeSearchPerformance = this.analyzeSearchPerformance.bind(this);
    this.categorizeEntity = this.categorizeEntity.bind(this);
  }

  // Categorize the entity type using AI
  async categorizeEntity(query) {
    try {
      const prompt = `
        Analyze this search query and determine what type of establishment the user is looking for.
        Query: "${query}"
        
        Return a JSON object with:
        {
          "entityType": "restaurant|supermarket|cafe|bar|hotel|other",
          "confidence": number between 0 and 1,
          "reasoning": "brief explanation of why this category was chosen"
        }
        
        Choose the most appropriate category based on the query content.
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error categorizing entity:', error);
      // Default fallback
      return {
        entityType: 'restaurant',
        confidence: 0.5,
        reasoning: 'Fallback due to error',
      };
    }
  }

  // Advanced query parsing with context understanding
  async parseAdvancedQuery(query, context = {}) {
    try {
      // First, categorize the entity type
      const entityCategory = await this.categorizeEntity(query);

      const prompt = `
        You are a search expert. Parse this query and extract structured information.
        
        Query: "${query}"
        Context: ${JSON.stringify(context)}
        Entity Type: ${entityCategory.entityType}
        
        Return a JSON object with:
        {
          "entityType": "${entityCategory.entityType}",
          "intent": "find|get_recommendations|compare_options|find_nearby",
          "searchTerms": "clean search keywords",
          "category": "specific category within the entity type",
          "priceRange": {"min": 1, "max": 4},
          "location": {
            "city": "city name",
            "neighborhood": "neighborhood",
            "radius": "distance in km if mentioned"
          },
          "features": ["booking", "discount", "verified", "delivery", "outdoor"],
          "atmosphere": "casual|formal|family|romantic|business|trendy",
          "timeContext": "morning|afternoon|evening|late-night|weekend",
          "groupSize": "number of people if mentioned",
          "occasion": "date|business|family|celebration",
          "sortBy": "rating|price|distance|popularity",
          "filters": {
            "minRating": "minimum rating if mentioned",
            "openNow": "if user wants open places",
            "hasReviews": "if user wants reviewed places"
          }
        }
        
        Be intelligent about inferring context. For example:
        - "romantic dinner" = atmosphere: "romantic", timeContext: "evening"
        - "cheap eats" = priceRange: {"min": 1, "max": 2}
        - "best rated sushi" = category: "sushi", sortBy: "rating"
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error in advanced query parsing:', error);
      return this.fallbackParsing(query);
    }
  }

  // Fallback parsing if AI fails
  fallbackParsing(query) {
    const keywords = query.toLowerCase();
    return {
      entityType: 'restaurant', // Default fallback
      intent: 'find',
      searchTerms: query,
      category: null,
      priceRange: {},
      location: {},
      features: [],
      atmosphere: null,
      timeContext: null,
      groupSize: null,
      occasion: null,
      sortBy: 'rating',
      filters: {},
    };
  }

  // Generate contextual embedding
  async generateContextualEmbedding(query, context) {
    try {
      const contextualQuery = this.buildContextualQuery(query, context);
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: contextualQuery,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating contextual embedding:', error);
      throw error;
    }
  }

  // Build contextual query for better embeddings
  buildContextualQuery(query, context) {
    let contextualQuery = query;

    if (context.entityType) {
      contextualQuery += ` ${context.entityType}`;
    }

    if (context.atmosphere) {
      contextualQuery += ` ${context.atmosphere} atmosphere`;
    }

    if (context.timeContext) {
      contextualQuery += ` ${context.timeContext}`;
    }

    if (context.occasion) {
      contextualQuery += ` ${context.occasion}`;
    }

    if (context.category) {
      contextualQuery += ` ${context.category}`;
    }

    return contextualQuery;
  }

  // Advanced hybrid search with multiple scoring strategies
  async hybridSearch(model, options) {
    const {
      query,
      parsedQuery,
      embedding,
      city,
      collection,
      limit = this.defaultLimit,
      page = 1,
      searchType = 'hybrid', // 'vector', 'text', 'hybrid'
      boostFactors = {},
    } = options;

    const skip = (page - 1) * limit;
    const pipeline = [];

    // Choose search strategy based on searchType
    switch (searchType) {
      case 'vector':
        if (embedding) {
          pipeline.push(
            ...this.buildVectorSearchPipeline(
              embedding,
              parsedQuery,
              city,
              collection,
            ),
          );
        }
        break;
      case 'text':
        pipeline.push(
          ...this.buildTextSearchPipeline(parsedQuery, city, collection),
        );
        break;
      case 'hybrid':
      default:
        pipeline.push(
          ...this.buildHybridSearchPipeline(
            embedding,
            parsedQuery,
            city,
            collection,
            boostFactors,
          ),
        );
        break;
    }

    // Add post-processing stages
    pipeline.push(
      ...this.buildPostProcessingPipeline(parsedQuery, skip, limit),
    );

    console.log('Final search pipeline:', JSON.stringify(pipeline, null, 2));
    const results = await model.aggregate(pipeline);
    return results;
  }

  // Build vector-only search pipeline
  buildVectorSearchPipeline(embedding, parsedQuery, city, collection) {
    return [
      {
        $vectorSearch: {
          index: 'entity_vector_index', // Generic index name
          path: 'embedding',
          queryVector: embedding,
          numCandidates: 100,
          limit: 50,
          filter: this.buildVectorFilters(parsedQuery, city, collection),
        },
      },
      {
        $addFields: {
          vectorScore: '$score',
        },
      },
    ];
  }

  // Build text-only search pipeline
  buildTextSearchPipeline(parsedQuery, city, collection) {
    const searchStage = {
      $search: {
        index: 'entity_text_index', // Generic index name
        compound: {
          should: this.buildTextSearchQueries(parsedQuery),
          filter: this.buildTextSearchFilters(parsedQuery, city, collection),
        },
      },
    };

    return [
      searchStage,
      {
        $addFields: {
          searchScore: { $meta: 'textScore' },
        },
      },
    ];
  }

  // Build hybrid search pipeline
  buildHybridSearchPipeline(
    embedding,
    parsedQuery,
    city,
    collection,
    boostFactors,
  ) {
    const pipeline = [];

    // Vector search stage
    if (embedding) {
      pipeline.push({
        $vectorSearch: {
          index: 'entity_vector_index', // Generic index name
          path: 'embedding',
          queryVector: embedding,
          numCandidates: 100,
          limit: 50,
          filter: this.buildVectorFilters(parsedQuery, city, collection),
        },
      });

      pipeline.push({
        $addFields: {
          vectorScore: '$score',
        },
      });
    }

    // Text search stage
    const textSearchStage = {
      $search: {
        index: 'entity_text_index', // Generic index name
        compound: {
          should: this.buildTextSearchQueries(parsedQuery),
          filter: this.buildTextSearchFilters(parsedQuery, city, collection),
        },
      },
    };

    pipeline.push(textSearchStage);

    // Combine scores
    const vectorWeight = boostFactors.vector || this.vectorWeight;
    const textWeight = boostFactors.text || this.textWeight;

    pipeline.push({
      $addFields: {
        textScore: { $meta: 'textScore' },
        searchScore: {
          $add: [
            { $multiply: [{ $ifNull: ['$vectorScore', 0] }, vectorWeight] },
            { $multiply: [{ $meta: 'textScore' }, textWeight] },
          ],
        },
      },
    });

    return pipeline;
  }

  // Build text search queries with intelligent boosting
  buildTextSearchQueries(parsedQuery) {
    const queries = [];

    // Main search terms
    if (parsedQuery.searchTerms) {
      queries.push({
        text: {
          query: parsedQuery.searchTerms,
          path: ['name', 'description', 'category', 'type'],
          score: { boost: { value: 2.0 } },
        },
      });

      // Autocomplete for name
      queries.push({
        autocomplete: {
          query: parsedQuery.searchTerms,
          path: 'name',
          score: { boost: { value: 1.5 } },
        },
      });
    }

    // Category-specific boost
    if (parsedQuery.category) {
      queries.push({
        text: {
          query: parsedQuery.category,
          path: ['category', 'type'],
          score: { boost: { value: 3.0 } },
        },
      });
    }

    // Entity type boost
    if (parsedQuery.entityType) {
      queries.push({
        text: {
          query: parsedQuery.entityType,
          path: 'entityType',
          score: { boost: { value: 2.5 } },
        },
      });
    }

    // Location boost
    if (parsedQuery.location?.city || parsedQuery.location?.neighborhood) {
      const locationQuery = [
        parsedQuery.location.city,
        parsedQuery.location.neighborhood,
      ]
        .filter(Boolean)
        .join(' ');

      queries.push({
        text: {
          query: locationQuery,
          path: ['city', 'neighborhood', 'location', 'address'],
          score: { boost: { value: 2.0 } },
        },
      });
    }

    // Atmosphere and context
    if (parsedQuery.atmosphere) {
      queries.push({
        text: {
          query: parsedQuery.atmosphere,
          path: ['description', 'ambiance'],
          score: { boost: { value: 1.3 } },
        },
      });
    }

    return queries;
  }

  // Build comprehensive filters
  buildVectorFilters(parsedQuery, city, collection) {
    const filters = { hide: { $ne: true } };

    if (city) filters.city = city;
    if (collection) filters.collection = collection;

    // Entity type filter
    if (parsedQuery.entityType) {
      filters.entityType = parsedQuery.entityType;
    }

    // Price range
    if (parsedQuery.priceRange?.min || parsedQuery.priceRange?.max) {
      const priceFilter = {};
      if (parsedQuery.priceRange.min)
        priceFilter.$gte = parsedQuery.priceRange.min;
      if (parsedQuery.priceRange.max)
        priceFilter.$lte = parsedQuery.priceRange.max;
      filters.priceLevel = priceFilter;
    }

    // Features
    parsedQuery.features?.forEach(feature => {
      switch (feature) {
        case 'booking':
          filters.bookingNeeded = true;
          break;
        case 'discount':
          filters.discount = true;
          break;
        case 'verified':
          filters.verifiedByHuman = true;
          break;
        case 'delivery':
          filters.delivery = true;
          break;
        case 'outdoor':
          filters.outdoorSeating = true;
          break;
      }
    });

    // Rating filter
    if (parsedQuery.filters?.minRating) {
      filters.rating = { $gte: parsedQuery.filters.minRating };
    }

    return filters;
  }

  buildTextSearchFilters(parsedQuery, city, collection) {
    const filters = [{ equals: { path: 'hide', value: false } }];

    if (city) {
      filters.push({ text: { path: 'city', query: city } });
    }

    if (collection) {
      filters.push({ text: { path: 'collection', query: collection } });
    }

    // Entity type filter
    if (parsedQuery.entityType) {
      filters.push({
        text: { path: 'entityType', query: parsedQuery.entityType },
      });
    }

    // Price range filters
    if (parsedQuery.priceRange?.min || parsedQuery.priceRange?.max) {
      const priceFilter = { path: 'priceLevel' };
      if (parsedQuery.priceRange.min)
        priceFilter.gte = parsedQuery.priceRange.min;
      if (parsedQuery.priceRange.max)
        priceFilter.lte = parsedQuery.priceRange.max;
      filters.push({ range: priceFilter });
    }

    // Feature filters
    parsedQuery.features?.forEach(feature => {
      switch (feature) {
        case 'booking':
          filters.push({ equals: { path: 'bookingNeeded', value: true } });
          break;
        case 'discount':
          filters.push({ equals: { path: 'discount', value: true } });
          break;
        case 'verified':
          filters.push({ equals: { path: 'verifiedByHuman', value: true } });
          break;
        case 'delivery':
          filters.push({ equals: { path: 'delivery', value: true } });
          break;
        case 'outdoor':
          filters.push({ equals: { path: 'outdoorSeating', value: true } });
          break;
      }
    });

    // Rating filter
    if (parsedQuery.filters?.minRating) {
      filters.push({
        range: {
          path: 'rating',
          gte: parsedQuery.filters.minRating,
        },
      });
    }

    return filters;
  }

  // Build post-processing pipeline
  buildPostProcessingPipeline(parsedQuery, skip, limit) {
    const pipeline = [];

    // Additional match filters for complex conditions
    const matchFilters = {};
    if (parsedQuery.filters?.hasReviews) {
      matchFilters.totalReviews = { $gt: 0 };
    }

    if (Object.keys(matchFilters).length > 0) {
      pipeline.push({ $match: matchFilters });
    }

    // Custom sorting based on parsed query
    const sortStage = this.buildSortStage(parsedQuery);
    pipeline.push(sortStage);

    // Pagination
    if (skip > 0) pipeline.push({ $skip: skip });
    pipeline.push({ $limit: Math.min(limit, this.maxLimit) });

    // Final projection
    pipeline.push({
      $project: {
        name: 1,
        type: 1,
        category: 1,
        entityType: 1,
        location: 1,
        neighborhood: 1,
        city: 1,
        address: 1,
        coordinates: 1,
        imageUrl: 1,
        rating: 1,
        totalReviews: 1,
        priceLevel: 1,
        contact: 1,
        openingHours: 1,
        discount: 1,
        percentageDiscount: 1,
        bookingNeeded: 1,
        description: 1,
        collection: 1,
        highlighted: 1,
        verifiedByHuman: 1,
        websiteUrl: 1,
        mapsUrl: 1,
        searchScore: 1,
        vectorScore: { $ifNull: ['$vectorScore', 0] },
        textScore: { $ifNull: ['$textScore', 0] },
      },
    });

    return pipeline;
  }

  // Build intelligent sort stage
  buildSortStage(parsedQuery) {
    const sortBy = parsedQuery.sortBy;

    switch (sortBy) {
      case 'rating':
        return { $sort: { rating: -1, totalReviews: -1, searchScore: -1 } };
      case 'price':
        return { $sort: { priceLevel: 1, searchScore: -1 } };
      case 'popularity':
        return { $sort: { totalReviews: -1, rating: -1, searchScore: -1 } };
      case 'distance':
        // Note: Distance sorting would require geo queries
        return { $sort: { searchScore: -1, rating: -1 } };
      default:
        return {
          $sort: {
            searchScore: -1,
            highlighted: -1,
            priority: -1,
            rating: -1,
            totalReviews: -1,
          },
        };
    }
  }

  // Get search suggestions
  async getSearchSuggestions(model, query, limit = 10) {
    try {
      const pipeline = [
        {
          $search: {
            index: 'entity_text_index', // Generic index name
            autocomplete: {
              query: query,
              path: 'name',
            },
          },
        },
        { $limit: limit },
        {
          $project: {
            name: 1,
            type: 1,
            category: 1,
            entityType: 1,
            city: 1,
            score: { $meta: 'textScore' },
          },
        },
      ];

      const suggestions = await model.aggregate(pipeline);
      return suggestions;
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  }

  // Analyze search performance
  async analyzeSearchPerformance(query, results, executionTime) {
    const analysis = {
      query,
      resultCount: results.length,
      executionTime,
      avgScore: 0,
      scoreDistribution: { high: 0, medium: 0, low: 0 },
      hasHighQualityResults: false,
    };

    if (results.length > 0) {
      const scores = results.map(r => r.searchScore || 0);
      analysis.avgScore =
        scores.reduce((sum, score) => sum + score, 0) / scores.length;

      scores.forEach(score => {
        if (score > 5) analysis.scoreDistribution.high++;
        else if (score > 2) analysis.scoreDistribution.medium++;
        else analysis.scoreDistribution.low++;
      });

      analysis.hasHighQualityResults = analysis.scoreDistribution.high > 0;
    }

    return analysis;
  }
}

export const aiSearchService = new AiSearchService();
