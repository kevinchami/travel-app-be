import express from 'express';
import { countryController } from '../controllers/index.js';

const router = express.Router();

router.get('/', countryController.getCountries);
router.post('/create', countryController.createCountry);

export default router;
