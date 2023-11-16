// routes/templeRoutes.js

import express from 'express';
import { authController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.post('/register', authController.newUser);
router.post('/login', authController.loginUser);

export default router;
