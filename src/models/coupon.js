import { Schema, model } from 'mongoose';

const CouponSchema = new Schema(
  {
    couponId: { type: String, required: true, unique: true },
    userId: { type: String, required: false },
    restaurantId: { type: String, required: true },
    used: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

CouponSchema.index({ couponId: 1 });

const Coupon = model('Coupon', CouponSchema);

export default Coupon;
