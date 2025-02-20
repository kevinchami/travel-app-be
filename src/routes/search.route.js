import express from 'express';
import { safe } from '../utils/error-handling.js';
import { searchController } from '../controllers/index.js';

const router = express.Router();

router.post('/search', safe(searchController.search));

export default router;
