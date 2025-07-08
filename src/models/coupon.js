import { Schema, model } from 'mongoose';

const CouponSchema = new Schema(
  {
    couponId: { type: String, required: true, unique: true },
    userId: { type: String, required: false },
    itemId: { type: String, required: true },
    used: { type: Boolean, default: false },
    usedAt: { type: Date },
    usedByIp: { type: String },
    userAgent: { type: String },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: false },
  },
  { timestamps: true },
);

CouponSchema.index({ couponId: 1 });

const Coupon = model('Coupon', CouponSchema);

export default Coupon;
