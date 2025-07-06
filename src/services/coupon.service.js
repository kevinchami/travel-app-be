import Coupon from '../models/coupon.js';

export const createCoupon = async (data) => {
  return await Coupon.create(data);
};

export const validateCoupon = async (couponId) => {
  const coupon = await Coupon.findOne({ couponId });

  if (!coupon) {
    return { valid: false, reason: 'not_found' };
  }

  if (coupon.used) {
    return { valid: false, reason: 'already_used' };
  }

  // marcar como usado
  coupon.used = true;
  await coupon.save();

  return { valid: true, coupon };
};
