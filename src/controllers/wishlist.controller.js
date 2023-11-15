import { wishlistService } from '../services/index.js';

// Add item to wishlist
export const addToWishlist = async (req, res) => {
  const { userId } = req.params;
  const { itemId, category } = req.body;

  try {
    const wishlistItem = await wishlistService.addToWishlist(
      userId,
      itemId,
      category,
    );
    return res.status(201).json(wishlistItem);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
  const { userId, productId, category } = req.params;

  try {
    const deletedItem = await wishlistService.removeFromWishlist(
      userId,
      productId,
      category,
    );
    return res.status(200).json(deletedItem);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    const wishlistItems = await wishlistService.getWishlist(userId);
    return res.status(200).json(wishlistItems);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get wishlist items by category
export const getWishlistItemsByCategory = async (req, res) => {
  const { userId, category } = req.params;

  try {
    const wishlistItems = await wishlistService.getWishlistItemsByCategory(
      userId,
      category,
    );
    return res.status(200).json(wishlistItems);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
