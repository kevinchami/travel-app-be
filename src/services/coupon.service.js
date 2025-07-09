import Coupon from '../models/coupon.js';
import Restaurant from '../models/restaurant.js';
import Stay from '../models/accomodation.js';
import Cafe from '../models/cafe.js';
import { getFromDateByPolicy } from '../utils/getFromDateByPolicy.js';

const modelMap = {
  restaurant: Restaurant,
  accommodation: Stay,
  cafe: Cafe,
};

// export const createCoupon = async ({ userId, restaurantId, couponId }) => {
//   const restaurant = await Restaurant.findById(restaurantId);
//   const policy = restaurant?.generationPolicy || 'daily';
//   const fromDate = getFromDateByPolicy(policy);
//   // Buscar cupón activo
//   const existing = await Coupon.findOne({
//     userId,
//     restaurantId,
//     createdAt: { $gte: fromDate },
//     // used: false,
//     // expiresAt: { $gt: new Date() },
//   });

//   if (existing) return existing;

//   // Si no existe, crear uno nuevo
//   return await Coupon.create({
//     userId,
//     restaurantId,
//     couponId,
//     expiresAt: new Date(Date.now() + 60 * 60 * 1000),
//   });
// };
export const createCoupon = async ({ userId, itemId, category, couponId }) => {
  const Model = modelMap[category];
  if (!Model) throw new Error(`Invalid category: ${category}`);

  const item = await Model.findById(itemId);
  const policy = item?.generationPolicy || 'daily';

  const fromDate = getFromDateByPolicy(policy);

  // Buscar si ya existe uno reciente
  const existing = await Coupon.findOne({
    userId,
    itemId,
    createdAt: { $gte: fromDate },
  });

  if (existing) {
    const now = new Date();
    if (existing.used) return existing; // usado: no puede generar nuevo
    if (existing.expiresAt && existing.expiresAt > now) return existing; // aún válido: no puede generar nuevo
    // expirado pero no usado → sigue y genera uno nuevo
  }

  // Crear nuevo
  return await Coupon.create({
    userId,
    itemId,
    couponId,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });
};

export const validateCoupon = async couponId => {
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

export const findCoupon = async couponId => {
  return await Coupon.findOne({ couponId });
};

export const consumeCoupon = async (couponId, reqIp, reqUserAgent) => {
  const coupon = await Coupon.findOne({ couponId });

  if (!coupon) return { success: false, reason: 'not_found' };
  if (coupon.used) return { success: false, reason: 'already_used' };
  if (new Date() > coupon.expiresAt)
    return { success: false, reason: 'expired' };

  coupon.used = true;
  coupon.usedAt = new Date();
  coupon.usedByIp = reqIp;
  coupon.userAgent = reqUserAgent;

  await coupon.save();

  return { success: true };
};
