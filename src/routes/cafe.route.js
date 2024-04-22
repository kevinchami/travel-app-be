import express from 'express';
import { cafeController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

// Adapted route for adding a new cafe
router.post('/addcafe', safe(cafeController.addCafe));

// Adapted route for fetching all cafes
router.get('/getcafes', safe(cafeController.getCafes));

// Adapted route for fetching a single cafe by ID
router.get('/getcafe/:cafeId', safe(cafeController.getCafeById));

// Adapted route for fetching cafes by city
router.get('/getcafesbycity/:cityId', safe(cafeController.getCafesByCity));

// Adapted route for removing a cafe by ID
router.delete('/removecafe/:cafeId', safe(cafeController.removeCafeById));

// Adapted route for updating a cafe
router.put('/updatecafe/:cafeId', safe(cafeController.updateCafe));

// Add a new route to get distinct types for filtering cafes
router.get('/getdistinctcafetypes', safe(cafeController.getDistinctCafeTypes));

export default router;
