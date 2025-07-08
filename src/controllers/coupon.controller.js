import { couponService } from '../services/index.js';

export const generateCoupon = async (req, res) => {
  const { userId, itemId, category } = req.body;

  const couponId = `${itemId}-${Date.now()}`; // o usá uuid
  const coupon = await couponService.createCoupon({
    userId,
    itemId,
    category,
    couponId,
  });

  return res.status(201).json({ coupon });
};

export const getCouponStatus = async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: 'Missing coupon ID' });

  const coupon = await couponService.findCoupon(id);
  if (!coupon)
    return res.status(404).json({ valid: false, reason: 'not_found' });
  if (new Date() > coupon.expiresAt)
    return res.status(400).json({ valid: false, reason: 'expired' });

  return res.status(200).json({
    valid: !coupon.used,
    used: coupon.used,
    restaurantId: coupon.restaurantId,
    couponId: coupon.couponId,
    createdAt: coupon.createdAt,
  });
};
export const consumeCoupon = async (req, res) => {
  const { couponId } = req.body;

  if (!couponId) {
    return res.status(400).json({ error: 'Missing couponId' });
  }

  const reqIp =
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.connection.remoteAddress;
  const reqUserAgent = req.headers['user-agent'];

  const result = await couponService.consumeCoupon(
    couponId,
    reqIp,
    reqUserAgent,
  );

  if (!result.success) {
    return res.status(400).json({ error: result.reason });
  }

  return res.status(200).json({ message: 'Coupon consumed successfully' });
};

export const verifyCoupon = async (req, res) => {
  const { id } = req.query;

  const result = await couponService.validateCoupon(id);

  if (!result.valid) {
    return res.send(`<h2>❌ Invalid or used coupon</h2>`);
  }

  return res.send(`<h2>✅ Coupon valid! Welcome!</h2>`);
};
