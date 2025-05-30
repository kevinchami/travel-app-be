import { Schema, model } from 'mongoose';
import { addHideFilterMiddleware } from '../middleware/autoHideFilter.js';

const SupermarketSchema = new Schema(
  {
    countryId: { type: String, required: false },
    name: { type: String, required: true },
    contact: { type: Number, required: false },
    textHebrew: { type: Boolean, required: false, default: false },
    imageUrl: [{ type: String, required: true }],
    menuUrl: { type: String, required: false },
    personalOpinion: { type: String, required: false },
    hide: { type: Boolean, required: false },
    mapsUrl: { type: String, required: false },
    kosherBoolean: { type: Boolean, required: false },
    allKosherBoolean: { type: Boolean, required: false },
    // bookingNeeded: { type: Boolean, required: false},
    priority: { type: Number, required: false },
    highlighted: { type: Boolean, required: false, default: false },
    embedding: [Number],
    openingHours: [{ type: String, required: false }],
    category: {
      type: String,
      required: false,
      default: 'supermarket',
    },
    rating: { type: Number, required: false },
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
      required: false,
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
SupermarketSchema.index({ city: 1 });
SupermarketSchema.index({ type: 1 });
SupermarketSchema.index({ name: 1 });
SupermarketSchema.index({ rating: -1 });

addHideFilterMiddleware(SupermarketSchema);

const Supermarket = model('Supermarket', SupermarketSchema);

export default Supermarket;
