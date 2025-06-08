import { Schema, model } from 'mongoose';
import { addHideFilterMiddleware } from '../middleware/autoHideFilter.js';

const RestaurantSchema = new Schema(
  {
    countryId: { type: String, required: false },
    name: { type: String, required: true },
    contact: { type: Number, required: false },
    textHebrew: { type: Boolean, required: false, default: false },
    imageUrl: [{ type: String, required: true }],
    menuUrl: { type: String, required: false },
    personalOpinion: { type: String, required: false },
    mapsUrl: { type: String, required: false },
    hide: { type: Boolean, required: false },
    kosherBoolean: { type: Boolean, required: false },
    vegan: { type: Boolean, required: false },
    vegetarian: { type: Boolean, required: false },
    bookingNeeded: { type: Boolean, required: false },
    priority: { type: Number, required: false },
    highlighted: { type: Boolean, required: false, default: false },
    openingHours: [{ type: String, required: false }],
    rating: { type: Number, required: false },
    totalReviews: { type: Number, required: false },
    topReviews: [
      {
        authorName: String,
        text: String,
        rating: Number,
      },
    ],
    embedding: [Number],
    category: {
      type: String,
      required: false,
      default: 'restaurant',
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    location: { type: String, required: true },
    neighborhood: { type: String, required: false },
    type: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: false,
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: 'City',
    },
    coordinates: {
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false },
    },
  },
  { timestamps: true },
);

// Adding indexes for optimization
RestaurantSchema.index({ city: 1 });
RestaurantSchema.index({ type: 1 });
RestaurantSchema.index({ name: 1 });
RestaurantSchema.index({ rating: -1 });

addHideFilterMiddleware(RestaurantSchema);

const Restaurant = model('Restaurant', RestaurantSchema);

export default Restaurant;
