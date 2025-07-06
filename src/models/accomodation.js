import { Schema, model } from 'mongoose';
import { addHideFilterMiddleware } from '../middleware/autoHideFilter.js';

const AccomodationSchema = new Schema(
  {
    countryId: { type: String, required: false },
    name: { type: String, required: true },
    description: { type: String, required: false },
    textHebrew: { type: Boolean, required: false, default: false },
    price: { type: Number, required: false },
    guests: { type: Number, required: false },
    kosherBoolean: { type: Boolean, required: false },
    priceDetail: { type: String, required: false },
    priceShow: { type: Boolean, required: false, default: false },
    webUrl: { type: String, required: false },
    bookingUrl: { type: String, required: false },
    airbnbUrl: { type: String, required: false },
    discount: { type: Boolean, required: false },
    percentageDiscount: { type: Number, required: false },
    mapsUrl: { type: String, required: false },
    contact: { type: Number, required: false },
    imageUrl: [{ type: String, required: true }],
    priority: { type: Number, required: false },
    hide: { type: Boolean, required: false },
    highlighted: { type: Boolean, required: false, default: false },
    languages: {
      type: [String],
      required: false,
    },
    category: {
      type: String,
      enum: ['temple', 'tour', 'restaurant', 'accommodation'],
      required: false,
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
    embedding: [Number],
    category: {
      type: String,
      required: true,
      default: 'accommodation',
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
    facilities: [
      {
        wifi: { type: Boolean, default: true },
      },
      {
        parking: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true },
);

addHideFilterMiddleware(AccomodationSchema);

const Accomodation = model('Accomodation', AccomodationSchema);

export default Accomodation;
