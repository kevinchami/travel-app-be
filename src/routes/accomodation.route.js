import express from 'express';
import { accommodationController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.post(
  '/addaccommodation',
  safe(accommodationController.addAccommodation),
);

router.post(
  '/addaccommodationcity',
  safe(accommodationController.addAccommodationToCity),
);

router.get(
  '/getaccommodations',
  safe(accommodationController.getAccommodations),
);
router.get(
  '/getaccommodation/:accommodationId',
  safe(accommodationController.getAccommodationById),
);
router.get(
  '/getaccommodationsbycity/:cityId',
  safe(accommodationController.getAccommodationsByCity),
);
router.delete(
  '/removeaccommodation/:accommodationId',
  safe(accommodationController.removeAccommodationById),
);
router.put(
  '/updateaccommodation/:accommodationId',
  safe(accommodationController.updateAccommodation),
);

export default router;
