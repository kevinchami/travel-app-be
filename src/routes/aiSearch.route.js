import express from 'express';
import { safe } from '../utils/error-handling.js';
import { aiSearchController } from '../controllers/aiSearch.controller.js';

const router = express.Router();

// 1) LLM parse + search orchestrated across collections
router.post('/search', safe(aiSearchController.search));

// 2) Simple search with filters, still going through AI parser but lighter
router.post('/simple-search', safe(aiSearchController.searchSimple));

// 3) Types dictionary, optionally by collection or city
router.get('/types', safe(aiSearchController.getTypes));

// 4) Neighborhoods dictionary, optionally by city
router.get('/neighborhoods', safe(aiSearchController.getNeighborhoods));

// 5) Extract types directly from items payload
router.post('/types/from-items', safe(aiSearchController.getTypesFromItems));

export default router;
