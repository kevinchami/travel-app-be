import express from 'express';
import { safe } from '../utils/error-handling.js';
import { searchController } from '../controllers/index.js';

const router = express.Router();

router.post('/search', safe(searchController.search));
router.post('/simple-search', safe(searchController.searchSimple));
router.get('/types', safe(searchController.getTypes)); 
router.get('/neighborhoods', safe(searchController.getNeighborhoods));

export default router;
