// routes/templeRoutes.js

import express from 'express';
import { userController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.post('/adduser', safe(userController.createUser));
router.get('/getusers', safe(userController.listUsers));

export default router;
