// routes/templeRoutes.js

import express from 'express';
import { userController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';
import { verifyToken } from '../../middleware/jwt_token.js';

const router = express.Router();

router.post('/adduser', safe(userController.createUser));
router.get('/getusers', safe(userController.listUsers));

router.delete('/delete/:userId', verifyToken, safe(userController.deleteUser));
router.get('/:userId', safe(userController.getUser));
router.put('/:userId/updateUserName', userController.updateUserName);

export default router;
