import { Schema, model } from 'mongoose';
import Tour from './tour.js';
import Accommodation from './accomodation.js';
import Restaurant from './restaurant.js';
import Activity from './activity.js';

const WishlistSchema = new Schema(
  {
    //userId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: String, required: true },
    itemId: {
      type: Schema.Types.ObjectId,
      //ref: 'Tour',
      required: true,
    },
    category: { type: String, required: true }, // 'accommodation', 'restaurant', 'tour', etc.
  },
  { timestamps: true },
);

// Use populate to automatically retrieve data from the Tour model
WishlistSchema.pre('find', function (next) {
  const category = this.getQuery().category;
  const modelToPopulate = getModelByCategory(category);
  this.populate('itemId', null, modelToPopulate);
  next();
});

// Helper function to get the corresponding model based on the category
function getModelByCategory(category) {
  switch (category) {
    case 'tour':
      return Tour;
    case 'accommodation':
      return Accommodation;
    case 'restaurant':
      return Restaurant;
    case 'activity':
      return Activity;
    default:
      return null;
  }
}

const Wishlist = model('Wishlist', WishlistSchema);

export default Wishlist;
