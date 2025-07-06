import { couponService } from '../services/index.js';

export const generateCoupon = async (req, res) => {
  const { userId, restaurantId } = req.body;

  const couponId = `${restaurantId}-${Date.now()}`; // o usá uuid
  const coupon = await couponService.createCoupon({
    userId,
    restaurantId,
    couponId,
  });

  return res.status(201).json({ coupon });
};

export const verifyCoupon = async (req, res) => {
  const { id } = req.query;

  const result = await couponService.validateCoupon(id);

  if (!result.valid) {
    return res.send(`<h2>❌ Invalid or used coupon</h2>`);
  }

  return res.send(`<h2>✅ Coupon valid! Welcome!</h2>`);
};
