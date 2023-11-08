// routes/templeRoutes.js

import express from 'express';
import { tourController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.post('/addtour', safe(tourController.addTour));

router.post('/addtourtocity', safe(tourController.addTourToCity));

router.get('/gettours', safe(tourController.getTours));

router.get('/gettour/:tourId', safe(tourController.getTourById));

router.delete('/removetour/:tourId', safe(tourController.removeTourById));

router.put('/updatetour/:tourId', safe(tourController.updateTour));

router.get('/gettoursbycity/:cityId', safe(tourController.getToursByCity));

export default router;
