// routes/mustRoutes.js

import express from 'express';
import { mustController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.post('/addmust', safe(mustController.addMust));

router.get('/getmusts', safe(mustController.getMusts));

router.get('/getmust/:mustId', safe(mustController.getMustById));

router.delete('/removemust/:mustId', safe(mustController.removeMustById));

router.put('/updatemust/:mustId', safe(mustController.updateMust));

router.get('/getmustsbycity/:cityId', safe(mustController.getMustsByCity));

router.get('/getdistincttypes', safe(mustController.getDistinctTypes));

// Nueva ruta para obtener musts por country
router.get('/getmustsbycountry/:countryId', safe(mustController.getMustsByCountry));

export default router;
