import express from 'express';
import { couponController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.post('/generate-coupon', safe(couponController.generateCoupon));
router.get('/validate-coupon', safe(couponController.verifyCoupon));
router.get('/status', safe(couponController.getCouponStatus));
router.post('/consume', safe(couponController.consumeCoupon));

export default router;
