import express from 'express';
import { translateQuery } from '../controllers/translation.controller.js';

const router = express.Router();

router.post('/translate', translateQuery);

export default router;
