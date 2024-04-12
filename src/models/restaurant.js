import { Schema, model } from 'mongoose';

const RestaurantSchema = new Schema(
  {
    countryId: { type: String, required: false },
    name: { type: String, required: true },
    contact: { type: Number, required: true },
    textHebrew: { type: Boolean, required: false, default: false },
    imageUrl: [{ type: String, required: true }],
    menuUrl: { type: String, required: true },
    mapsUrl: { type: String, required: true },
    kosherBoolean: { type: Boolean, required: true, default: true },
    bookingNeeded: { type: Boolean, required: true, default: true },
    priority: { type: Number, required: false },
    category: {
      type: String,
      enum: ['temple', 'tour', 'restaurant', 'accommodation'],
      required: false,
    },
    rating: { type: Number, required: true },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    location: { type: String, required: true },
    neighborhood: { type: String, required: false },

    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    type: {
      type: String,
      required: true,
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: 'City',
    },
  },
  { timestamps: true },
);

const Restaurant = model('Restaurant', RestaurantSchema);

export default Restaurant;
