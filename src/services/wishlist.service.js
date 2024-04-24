import Wishlist from '../models/wishlist.js';

// Add item to wishlist
export const addToWishlist = async (userId, itemId, category) => {
  try {
    // Check if the item already exists in the wishlist
    const existingItem = await Wishlist.findOne({ userId, itemId });

    if (existingItem) {
      console.log('Item already exists in the wishlist');
      return existingItem;
    }

    // If the item doesn't exist, add it to the wishlist
    const wishlistItem = new Wishlist({
      userId,
      itemId,
      category,
    });

    await wishlistItem.save();
    console.log('Item added to the wishlist');
    return wishlistItem;
  } catch (error) {
    console.error('Failed to add item to wishlist', error);
    throw error;
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (userId, productId, category) => {
  try {
    const deletedItem = await Wishlist.findOneAndDelete({
      userId,
      itemId: productId, // Update to match your schema field,
      category,
    });

    if (!deletedItem) {
      throw new Error('Item not found in wishlist');
    }
    console.log('====================================');
    console.log('delet item: ', deletedItem);
    console.log('====================================');
    return deletedItem;
  } catch (error) {
    throw new Error('Failed to remove item from wishlist' + error);
  }
};

// Get user's wishlist
export const getWishlist = async userId => {
  try {
    const wishlistItems = await Wishlist.find({ userId });
    return wishlistItems;
  } catch (error) {
    throw new Error('Failed to fetch wishlist');
  }
};

// Get wishlist items by category
export const getWishlistItemsByCategory = async (userId, category) => {
  try {
    const wishlistItems = await Wishlist.find({ userId, category });
    return wishlistItems;
  } catch (error) {
    throw new Error('Failed to get wishlist items by category');
  }
};
