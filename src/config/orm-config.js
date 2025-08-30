// src/config/orm-config.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// Connection URI - replace with your actual connection string
const uri = process.env.MONGODB_URI;

// Create a new MongoClient
const client = new MongoClient(uri);

let dbConnection;

export const connectToServer = async () => {
  try {
    await client.connect();
    dbConnection = client.db('travelapp'); // Replace with your database name
    console.log('Successfully connected to MongoDB.');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
};

export const getDbConnection = () => {
  if (!dbConnection) {
    throw new Error('Database not initialized. Call connectToServer first.');
  }
  return dbConnection;
};

export const closeConnection = async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed.');
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    throw err;
  }
};

// mongo con tu cuenta vieja
/*
  const USER = process.env.DB_USER || '';
  const PASSWORD = process.env.DB_PASSWORD || '';
  const DB_NAME = process.env.DB_NAME;

  try {
    await mongoose.connect(
      `mongodb+srv://${USER}:${PASSWORD}@cluster0.79gwo.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
    );
    console.log('Connected to DB');
  } catch (error) {
    console.error('DB Error: ', error);
  }
*/
//};
