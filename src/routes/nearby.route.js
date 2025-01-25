import express from 'express';
import { placeController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.post('/', safe(placeController.getNearbyPlaces));
router.post('/kosher', safe(placeController.getKosherNearbyPlaces));

export default router;
