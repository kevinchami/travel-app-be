import { Schema, model } from 'mongoose';
import { addHideFilterMiddleware } from '../middleware/autoHideFilter.js';

const TourSchema = new Schema(
  {
    countryId: { type: String, required: false },
    name: { type: String, required: true },
    description: { type: String, required: true },
    textHebrew: { type: Boolean, required: false, default: false },
    price: { type: Number, required: false },
    priceDetail: [{ type: String, required: false }],
    durationDetail: [{ type: String, required: false }],
    hide: { type: Boolean, required: false },
    contact: { type: Number, required: false },
    webUrl: { type: String, required: false },
    imageUrl: [{ type: String, required: true }],
    rating: { type: Number, required: false },
    review: { type: String, required: false },
    priority: { type: Number, required: false },
    highlighted: { type: Boolean, required: false, default: false },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    category: {
      type: String,
      enum: ['temple', 'tour', 'restaurant', 'accommodation'],
      required: false,
    },
    location: { type: String, required: true },
    city: {
      type: Schema.Types.ObjectId,
      ref: 'City',
      required: true,
    },
    coordinates: {
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false },
    },
    languages: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
);

addHideFilterMiddleware(TourSchema);

const Tour = model('Tour', TourSchema);

export default Tour;
