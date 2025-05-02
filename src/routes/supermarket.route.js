import express from 'express';
import { safe } from '../utils/error-handling.js';
import { supermarketController } from '../controllers/index.js';

const router = express.Router();

router.post('/addsupermarket', safe(supermarketController.addSupermarket));

router.get('/getsupermarkets', safe(supermarketController.getSupermarkets));

router.get(
  '/getsupermarket/:supermarketId',
  safe(supermarketController.getSupermarketById),
);

router.get(
  '/getsupermarketsbycity/:cityId',
  safe(supermarketController.getSupermarketsByCity),
);

router.delete(
  '/removesupermarket/:supermarketId',
  safe(supermarketController.removeSupermarketById),
);

router.put(
  '/updatesupermarket/:supermarketId',
  safe(supermarketController.updateSupermarket),
);

// Get distinct types for filtering
router.get('/getdistincttypes', safe(supermarketController.getDistinctTypes));

router.get(
  '/gethighlightedsupermarketsbycountry/:countryName',
  safe(supermarketController.getHighlightedSupermarketsByCountry),
);

export default router;
