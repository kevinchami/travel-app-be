import express from 'express';
import { countryController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.get('/', safe(countryController.getCountries));
router.post('/create', safe(countryController.createCountry));
router.post('/addcity', safe(countryController.addCityToCountry)); // Add this line for the new functionality

export default router;
