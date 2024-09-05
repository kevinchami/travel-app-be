import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import apiRouter from './routes/index.js';
import dotenv from 'dotenv';
import dbConnection from './config/orm-config.js';

dotenv.config();

dbConnection();

const app = express();

/* 
Middlewares: every time you see "app.use" we are including a new
middleware to the express server.
*/
app.use(
  cors({
    origin: [
      'https://travel-app-be.onrender.com',
      'http://localhost:5173',
      'https://dashboard-latiul.vercel.app',
    ], // Permitir ambos orígenes
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Permitir cookies y credenciales si es necesario
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  express.json({ limit: '50mb' })(req, res, next);
});

app.use(morgan('dev')); // logging

// import the routes from the ./routes/index.ts file
app.use(apiRouter);

// default empty route for 404
app.use((_, res) => res.status(404).json({ message: 'Not found' }));

export default app;
