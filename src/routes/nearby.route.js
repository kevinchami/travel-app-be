import express from 'express';
import { placeController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.post('/nearby', safe(placeController.getNearbyPlaces));

export default router;
