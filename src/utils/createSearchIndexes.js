import { MongoClient } from 'mongodb';

// Replace with your Atlas connection string
const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);

export async function createSearchIndexes() {
  try {
    await client.connect();
    console.log('Connected to Atlas');

    const database = client.db(); // Uses the default database from connection string
    const collection = database.collection('businesses');

    // Create Vector Search Index
    const vectorIndex = {
      name: 'business_vector_index',
      type: 'vectorSearch',
      definition: {
        fields: [
          {
            type: 'vector',
            path: 'embedding',
            numDimensions: 1536, // Adjust based on your embedding model
            similarity: 'cosine',
          },
          {
            type: 'filter',
            path: 'businessType',
          },
          {
            type: 'filter',
            path: 'city',
          },
          {
            type: 'filter',
            path: 'category',
          },
          {
            type: 'filter',
            path: 'hide',
          },
          {
            type: 'filter',
            path: 'priceLevel',
          },
          {
            type: 'filter',
            path: 'kosherBoolean',
          },
          {
            type: 'filter',
            path: 'vegan',
          },
          {
            type: 'filter',
            path: 'vegetarian',
          },
          {
            type: 'filter',
            path: 'delivery',
          },
          {
            type: 'filter',
            path: 'bookingNeeded',
          },
          {
            type: 'filter',
            path: 'discount',
          },
          {
            type: 'filter',
            path: 'verifiedByHuman',
          },
        ],
      },
    };

    // Create Text Search Index
    const textIndex = {
      name: 'business_text_index',
      type: 'search',
      definition: {
        mappings: {
          dynamic: true,
          fields: {
            name: {
              type: 'string',
              analyzer: 'lucene.standard',
            },
            businessType: {
              type: 'string',
              analyzer: 'lucene.standard',
            },
            category: {
              type: 'string',
              analyzer: 'lucene.standard',
            },
            city: {
              type: 'string',
              analyzer: 'lucene.standard',
            },
            neighborhood: {
              type: 'string',
              analyzer: 'lucene.standard',
            },
            location: {
              type: 'string',
              analyzer: 'lucene.standard',
            },
            address: {
              type: 'string',
              analyzer: 'lucene.standard',
            },
            details: {
              type: 'string',
              analyzer: 'lucene.standard',
            },
            description: {
              type: 'string',
              analyzer: 'lucene.standard',
            },
          },
        },
      },
    };

    // Create the indexes
    const vectorResult = await collection.createSearchIndex(vectorIndex);
    console.log('Vector search index created:', vectorResult);

    const textResult = await collection.createSearchIndex(textIndex);
    console.log('Text search index created:', textResult);

    console.log('All search indexes created successfully');
  } catch (error) {
    console.error('Error creating search indexes:', error);
  } finally {
    await client.close();
  }
}

// Run the function
createSearchIndexes();
