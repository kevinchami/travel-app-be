import express from 'express';
import {
  translateEnglish,
  translateHebrew,
  translateQuery,
  translateSpanish,
} from '../controllers/translation.controller.js';

const router = express.Router();

router.post('/translate', translateQuery);
router.post('/translate/english', translateEnglish);
router.post('/translate/hebrew', translateHebrew);
router.post('/translate/spanish', translateSpanish);

export default router;
