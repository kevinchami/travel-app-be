import express from 'express';
import { countryController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.get('/', safe(countryController.getCountries));
router.post('/create', safe(countryController.createCountry));

export default router;
