import express from 'express';
import { wishlistController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.post('/add/:userId', wishlistController.addToWishlist);
router.delete(
  '/remove/:userId/:productId/:category',
  wishlistController.removeFromWishlist,
);
router.get('/:userId', wishlistController.getWishlist);
router.get(
  '/category/:userId/:category',
  wishlistController.getWishlistItemsByCategory,
);

export default router;
