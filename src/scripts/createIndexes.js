// createindexes.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function createSearchIndexes() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.DB_NAME);

  // For Restaurants
  await db.collection('restaurants').createSearchIndex({
    name: 'text_search',
    definition: {
      mappings: {
        dynamic: true,
        fields: {
          name: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
          details: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
          address: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
          city: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
          neighborhood: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
          type: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
          supervision: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
        },
      },
    },
  });

  // For Cafes
  await db.collection('cafes').createSearchIndex({
    name: 'text_search',
    definition: {
      mappings: {
        dynamic: true,
        fields: {
          name: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
          details: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
          address: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
          city: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
          neighborhood: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
          type: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
          supervision: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
        },
      },
    },
  });

  // For Supermarkets
  await db.collection('supermarkets').createSearchIndex({
    name: 'text_search',
    definition: {
      mappings: {
        dynamic: true,
        fields: {
          name: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
          details: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
          address: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
          city: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
          neighborhood: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
          type: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
          supervision: {
            type: 'string',
            analyzer: 'lucene.standard',
            searchAnalyzer: 'lucene.standard',
          },
        },
      },
    },
  });

  await client.close();
  console.log('Search indexes created');
}

createSearchIndexes().catch(console.error);
