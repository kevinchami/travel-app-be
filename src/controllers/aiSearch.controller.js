// controllers/aiSearch.controller.js
import OpenAI from 'openai';
import { aiSearchService } from '../services/aiSearch.service.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Import models dynamically
const getEntityModel = entityType => {
  switch (entityType) {
    case 'restaurant':
      return import('../models/Restaurant.js').then(m => m.default);
    case 'supermarket':
      return import('../models/Supermarket.js').then(m => m.default);
    case 'cafe':
      return import('../models/Cafe.js').then(m => m.default);
    case 'bar':
      return import('../models/Bar.js').then(m => m.default);
    case 'hotel':
      return import('../models/Hotel.js').then(m => m.default);
    default:
      // Default to restaurant model
      return import('../models/Restaurant.js').then(m => m.default);
  }
};

class AISearchController {
  constructor() {
    // Bind all methods to preserve 'this' context
    this.generateEmbedding = this.generateEmbedding.bind(this);
    this.parseSearchQuery = this.parseSearchQuery.bind(this);
    this.buildSearchPipeline = this.buildSearchPipeline.bind(this);
    this.buildBaseFilters = this.buildBaseFilters.bind(this);
    this.buildDetailedFilters = this.buildDetailedFilters.bind(this);
    this.buildMatchFilters = this.buildMatchFilters.bind(this);
    this.search = this.search.bind(this);
    this.searchSimple = this.searchSimple.bind(this);
    this.getTypes = this.getTypes.bind(this);
    this.getNeighborhoods = this.getNeighborhoods.bind(this);
    this.getTypesFromItems = this.getTypesFromItems.bind(this);
  }

  // Generate embedding for search query
  async generateEmbedding(text) {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  // Parse user query with AI to extract structured filters
  async parseSearchQuery(query) {
    try {
      // First, categorize the entity type
      const entityCategory = await aiSearchService.categorizeEntity(query);

      const prompt = `
        Parse this search query and extract structured information as JSON:
        Query: "${query}"
        Entity Type: ${entityCategory.entityType}
        
        Extract and return ONLY a JSON object with these fields (use null if not mentioned):
        {
          "entityType": "${entityCategory.entityType}",
          "searchTerms": "main search keywords",
          "category": "specific category within the entity type",
          "priceLevel": number 1-4 if mentioned (1=cheap, 4=expensive),
          "location": "city/neighborhood if mentioned",
          "features": ["booking", "discount", "verified", "delivery", "outdoor"] (only if mentioned),
          "mood": "casual/formal/family/romantic etc if implied"
        }
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      return parsed;
    } catch (error) {
      console.error('Error parsing query:', error);
      // Fallback to basic parsing
      return {
        entityType: 'restaurant', // Default fallback
        searchTerms: query,
        category: null,
        priceLevel: null,
        location: null,
        features: [],
        mood: null,
      };
    }
  }

  // Build MongoDB Atlas Search aggregation pipeline
  buildSearchPipeline(parsedQuery, embedding, options = {}) {
    const { limit = 20, skip = 0, city, collection } = options;
    const pipeline = [];

    // 1. Vector Search Stage (if embedding provided)
    if (embedding) {
      pipeline.push({
        $vectorSearch: {
          index: 'entity_vector_index', // Generic index name
          path: 'embedding',
          queryVector: embedding,
          numCandidates: 100,
          limit: 50,
          filter: this.buildBaseFilters(parsedQuery, city, collection),
        },
      });
    }

    // 2. Text Search Stage (Atlas Search)
    const textSearchStage = {
      $search: {
        index: 'entity_text_index', // Generic index name
        compound: {
          should: [],
          filter: [],
        },
      },
    };

    // Add text search queries
    if (parsedQuery.searchTerms) {
      textSearchStage.$search.compound.should.push(
        {
          text: {
            query: parsedQuery.searchTerms,
            path: ['name', 'description', 'category', 'type'],
            score: { boost: { value: 2 } },
          },
        },
        {
          autocomplete: {
            query: parsedQuery.searchTerms,
            path: 'name',
            score: { boost: { value: 1.5 } },
          },
        },
      );
    }

    // Add category search
    if (parsedQuery.category) {
      textSearchStage.$search.compound.should.push({
        text: {
          query: parsedQuery.category,
          path: ['category', 'type'],
          score: { boost: { value: 3 } },
        },
      });
    }

    // Add entity type search
    if (parsedQuery.entityType) {
      textSearchStage.$search.compound.should.push({
        text: {
          query: parsedQuery.entityType,
          path: 'entityType',
          score: { boost: { value: 2.5 } },
        },
      });
    }

    // Add location search
    if (parsedQuery.location) {
      textSearchStage.$search.compound.should.push({
        text: {
          query: parsedQuery.location,
          path: ['city', 'neighborhood', 'location', 'address'],
          score: { boost: { value: 2 } },
        },
      });
    }

    // Add filters
    const filters = this.buildDetailedFilters(parsedQuery, city, collection);
    if (filters.length > 0) {
      textSearchStage.$search.compound.filter = filters;
    }

    // Add the text search stage if we have search criteria
    if (textSearchStage.$search.compound.should.length > 0 || !embedding) {
      pipeline.push(textSearchStage);
    }

    // 3. Add score for vector + text hybrid
    if (embedding) {
      pipeline.push({
        $addFields: {
          hybridScore: {
            $add: [
              { $multiply: ['$score', 0.7] }, // Text search weight
              { $multiply: [{ $ifNull: ['$vectorScore', 0] }, 0.3] }, // Vector weight
            ],
          },
        },
      });
    }

    // 4. Match stage for additional filters
    const matchFilters = this.buildMatchFilters(parsedQuery, city, collection);
    if (Object.keys(matchFilters).length > 0) {
      pipeline.push({ $match: matchFilters });
    }

    // 5. Sort by hybrid score or relevance
    pipeline.push({
      $sort: embedding
        ? { hybridScore: -1, priority: -1, rating: -1 }
        : { score: { $meta: 'textScore' }, priority: -1, rating: -1 },
    });

    // 6. Skip and limit
    if (skip > 0) pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // 7. Project final fields
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
        score: embedding ? '$hybridScore' : { $meta: 'textScore' },
      },
    });

    return pipeline;
  }

  // Build base filters for vector search
  buildBaseFilters(parsedQuery, city, collection) {
    const filters = { hide: { $ne: true } };

    if (city) filters.city = city;
    if (collection) filters.collection = collection;

    // Entity type filter
    if (parsedQuery.entityType) {
      filters.entityType = parsedQuery.entityType;
    }

    return filters;
  }

  // Build detailed filters for Atlas Search
  buildDetailedFilters(parsedQuery, city, collection) {
    const filters = [];

    // Base filters
    filters.push({ equals: { path: 'hide', value: false } });

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

    // Price level filter
    if (parsedQuery.priceLevel) {
      filters.push({
        range: {
          path: 'priceLevel',
          gte: parsedQuery.priceLevel - 0.5,
          lte: parsedQuery.priceLevel + 0.5,
        },
      });
    }

    // Feature filters
    if (parsedQuery.features.includes('booking')) {
      filters.push({ equals: { path: 'bookingNeeded', value: true } });
    }

    if (parsedQuery.features.includes('discount')) {
      filters.push({ equals: { path: 'discount', value: true } });
    }

    if (parsedQuery.features.includes('verified')) {
      filters.push({ equals: { path: 'verifiedByHuman', value: true } });
    }

    if (parsedQuery.features.includes('delivery')) {
      filters.push({ equals: { path: 'delivery', value: true } });
    }

    if (parsedQuery.features.includes('outdoor')) {
      filters.push({ equals: { path: 'outdoorSeating', value: true } });
    }

    return filters;
  }

  // Build match filters for additional filtering
  buildMatchFilters(parsedQuery, city, collection) {
    const filters = { hide: { $ne: true } };

    if (city) filters.city = new RegExp(city, 'i');
    if (collection) filters.collection = collection;

    // Entity type filter
    if (parsedQuery.entityType) {
      filters.entityType = parsedQuery.entityType;
    }

    return filters;
  }

  // Main search endpoint
  async search(req, res) {
    try {
      const {
        query,
        city,
        collection,
        limit = 20,
        page = 1,
        useVector = true,
        useText = true,
      } = req.body;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Query parameter is required',
        });
      }

      const skip = (page - 1) * limit;

      // Step 1: Parse query with AI
      const parsedQuery = await this.parseSearchQuery(query);
      console.log('Parsed query:', parsedQuery);

      // Step 2: Get the appropriate model based on entity type
      const EntityModel = await getEntityModel(parsedQuery.entityType);

      let embedding = null;
      if (useVector) {
        // Step 3: Generate embedding for semantic search
        embedding = await this.generateEmbedding(query);
      }

      // Step 4: Build and execute search pipeline
      const pipeline = this.buildSearchPipeline(parsedQuery, embedding, {
        limit: parseInt(limit),
        skip,
        city,
        collection,
      });

      console.log('Search pipeline:', JSON.stringify(pipeline, null, 2));
      const entities = await EntityModel.aggregate(pipeline);

      // Step 5: Get total count for pagination
      const countPipeline = [...pipeline.slice(0, -2)]; // Remove skip, limit, project
      countPipeline.push({ $count: 'total' });
      const countResult = await EntityModel.aggregate(countPipeline);
      const total = countResult[0]?.total || 0;

      res.json({
        success: true,
        data: {
          entities,
          entityType: parsedQuery.entityType,
          pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit),
          },
          parsedQuery,
          searchMetadata: {
            useVector,
            useText,
            resultsFound: entities.length,
          },
        },
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({
        success: false,
        message: 'Search failed',
        error: error.message,
      });
    }
  }

  // Simple search with lighter AI parsing
  async searchSimple(req, res) {
    try {
      const { query, city, collection, limit = 20, page = 1 } = req.body;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Query parameter is required',
        });
      }

      const skip = (page - 1) * limit;

      // First, categorize the entity type
      const entityCategory = await aiSearchService.categorizeEntity(query);

      // Get the appropriate model based on entity type
      const EntityModel = await getEntityModel(entityCategory.entityType);

      // Simple text search without heavy AI parsing
      const pipeline = [
        {
          $search: {
            index: 'entity_text_index', // Generic index name
            compound: {
              should: [
                {
                  text: {
                    query: query,
                    path: ['name', 'type', 'category', 'description'],
                    score: { boost: { value: 2 } },
                  },
                },
                {
                  autocomplete: {
                    query: query,
                    path: 'name',
                  },
                },
              ],
              filter: [
                { equals: { path: 'hide', value: false } },
                {
                  text: {
                    path: 'entityType',
                    query: entityCategory.entityType,
                  },
                },
              ],
            },
          },
        },
      ];

      // Add city filter if provided
      if (city) {
        pipeline[0].$search.compound.filter.push({
          text: { path: 'city', query: city },
        });
      }

      // Add collection filter if provided
      if (collection) {
        pipeline[0].$search.compound.filter.push({
          text: { path: 'collection', query: collection },
        });
      }

      pipeline.push(
        { $sort: { score: { $meta: 'textScore' }, priority: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) },
        {
          $project: {
            name: 1,
            type: 1,
            category: 1,
            entityType: 1,
            location: 1,
            neighborhood: 1,
            city: 1,
            coordinates: 1,
            imageUrl: 1,
            rating: 1,
            totalReviews: 1,
            priceLevel: 1,
            score: { $meta: 'textScore' },
          },
        },
      );

      const entities = await EntityModel.aggregate(pipeline);

      res.json({
        success: true,
        data: {
          entities,
          entityType: entityCategory.entityType,
          searchType: 'simple',
        },
      });
    } catch (error) {
      console.error('Simple search error:', error);
      res.status(500).json({
        success: false,
        message: 'Simple search failed',
        error: error.message,
      });
    }
  }

  // Get unique types/categories
  async getTypes(req, res) {
    try {
      const { city, collection, entityType = 'restaurant' } = req.query;

      // Get the appropriate model based on entity type
      const EntityModel = await getEntityModel(entityType);

      const matchStage = { hide: { $ne: true } };
      if (city) matchStage.city = new RegExp(city, 'i');
      if (collection) matchStage.collection = collection;

      const types = await EntityModel.aggregate([
        { $match: matchStage },
        { $unwind: '$type' },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
        { $project: { type: '$_id', count: 1, _id: 0 } },
      ]);

      res.json({
        success: true,
        data: types,
        entityType,
      });
    } catch (error) {
      console.error('Get types error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get types',
        error: error.message,
      });
    }
  }

  // Get unique neighborhoods
  async getNeighborhoods(req, res) {
    try {
      const { city, entityType = 'restaurant' } = req.query;

      // Get the appropriate model based on entity type
      const EntityModel = await getEntityModel(entityType);

      const matchStage = {
        hide: { $ne: true },
        neighborhood: { $exists: true, $ne: null, $ne: '' },
      };

      if (city) matchStage.city = new RegExp(city, 'i');

      const neighborhoods = await EntityModel.aggregate([
        { $match: matchStage },
        { $group: { _id: '$neighborhood', count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
        { $project: { neighborhood: '$_id', count: 1, _id: 0 } },
      ]);

      res.json({
        success: true,
        data: neighborhoods,
        entityType,
      });
    } catch (error) {
      console.error('Get neighborhoods error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get neighborhoods',
        error: error.message,
      });
    }
  }

  // Extract types from provided items
  async getTypesFromItems(req, res) {
    try {
      const { items, entityType = 'restaurant' } = req.body;

      if (!Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          message: 'Items must be an array',
        });
      }

      const typeCount = {};
      items.forEach(item => {
        if (item.type && Array.isArray(item.type)) {
          item.type.forEach(type => {
            typeCount[type] = (typeCount[type] || 0) + 1;
          });
        }
      });

      const types = Object.entries(typeCount)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

      res.json({
        success: true,
        data: types,
        entityType,
      });
    } catch (error) {
      console.error('Get types from items error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to extract types from items',
        error: error.message,
      });
    }
  }
}

export const aiSearchController = new AISearchController();
