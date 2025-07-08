import express from 'express';
import { couponController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';
import Coupon from '../models/coupon.js';

const router = express.Router();

router.post('/generate-coupon', safe(couponController.generateCoupon));
router.get('/validate-coupon', safe(couponController.verifyCoupon));
router.get('/status', safe(couponController.getCouponStatus));
router.post('/consume', safe(couponController.consumeCoupon));
router.delete('/reset-coupons', async (req, res) => {
  await Coupon.deleteMany({});
  res.status(200).json({ message: 'All coupons deleted' });
});

export default router;
