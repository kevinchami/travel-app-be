import express from 'express';
import { countryController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.get('/', safe(countryController.getCountries));
router.get('/getcountry', safe(countryController.getCountryById));
router.get('/country/:countryName', countryController.getCountryIdByName);
router.post('/create', safe(countryController.createCountry));
router.delete('/remove', safe(countryController.removeCountry));
router.post('/addcity', safe(countryController.addCityToCountry));
router.delete('/removecity', safe(countryController.removeCityFromCountry));
router.post('/update', safe(countryController.updateCountry));

export default router;
