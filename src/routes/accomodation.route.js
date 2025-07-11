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
router.get(
  '/filter/:countryName',
  accommodationController.filterAccommodationsByCountry,
);

router.get(
  '/gethighlightedaccommodations/:countryName',
  safe(accommodationController.filterHighlightAccommodationsByCountry),
);

router.get(
  '/gethighlightedaccommodationsbycity/:cityId',
  safe(accommodationController.filterHighlightAccommodationsByCity),
);

router.get(
  '/details/list',
  safe(accommodationController.getAllAccommodationDetails),
);

export default router;
