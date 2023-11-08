// routes/templeRoutes.js

import express from 'express';
import { templeController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.post('/addtemple', safe(templeController.addTemple));

router.get('/gettemples', safe(templeController.getTemples));

router.get('/gettemple/:templeId', safe(templeController.getTempleById));

router.get(
  '/gettemplesbycity/:cityId',
  safe(templeController.getTemplesByCity),
);

router.delete(
  '/removetemple/:templeId',
  safe(templeController.removeTempleById),
);

router.put('/updatetemple/:templeId', safe(templeController.updateTemple));

export default router;
