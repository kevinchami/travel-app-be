import express from 'express';
import { couponController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.post('/generate-coupon', safe(couponController.generateCoupon));
router.get('/validate-coupon', safe(couponController.verifyCoupon));

export default router;
