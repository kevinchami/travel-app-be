import { Schema, model } from 'mongoose';
import { addHideFilterMiddleware } from '../middleware/autoHideFilter.js';

const CafeSchema = new Schema(
  {
    countryId: { type: String, required: false },
    name: { type: String, required: true },
    supervision: { type: String, required: false },
    contact: { type: Number, required: false },
    textHebrew: { type: Boolean, required: false, default: false },
    imageUrl: [{ type: String, required: true }],
    isCoffee: { type: Boolean, required: true, default: true },
    menuUrl: { type: String, required: false },
    personalOpinion: { type: String, required: false },
    mapsUrl: { type: String, required: true },
    vegan: { type: Boolean, required: false },
    discount: { type: Boolean, required: false },
    percentageDiscount: { type: Number, required: false },
    verifiedByHuman: { type: Boolean, required: false },
    kosherBoolean: { type: Boolean, required: true },
    bookingNeeded: { type: Boolean, required: false, default: false },
    hide: { type: Boolean, required: false },
    openingHours: [{ type: String, required: false }],
    priority: { type: Number, required: false },
    highlighted: { type: Boolean, required: false, default: false },
    category: {
      type: String,
      enum: ['temple', 'tour', 'restaurant', 'accommodation', 'cafe'],
      required: false,
      default: 'restaurant',
    },
    coordinates: {
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false },
    },
    rating: { type: Number, required: false },
    totalReviews: { type: Number, required: false },
    topReviews: [
      {
        authorName: String,
        text: String,
        rating: Number,
      },
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    location: { type: String, required: true },
    neighborhood: { type: String, required: true },
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
  },
  { timestamps: true },
);

addHideFilterMiddleware(CafeSchema);

const Cafe = model('Cafe', CafeSchema, 'cafes');

export default Cafe;
