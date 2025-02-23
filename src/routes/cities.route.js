import express from 'express';
import { cityController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.get('/', safe(cityController.getCities));
router.get('/country/:countryId', safe(cityController.getCitiesByCountry));
router.get('/city/:cityId', safe(cityController.getCityById));
router.put('/updatecity/:cityId', safe(cityController.updateCity));
router.post('/add', safe(cityController.addCityToCountry));
router.delete('/removecity', safe(cityController.removeCityFromCountry));
router.get('/cityId/:cityName', safe(cityController.getCityIdByName));


export default router;
