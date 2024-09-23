import { Schema, model } from 'mongoose';

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
    kosherBoolean: { type: Boolean, required: false},
    bookingNeeded: { type: Boolean, required: false},
    priority: { type: Number, required: false },
    highlighted: { type: Boolean, required: false, default: false },
    category: {
      type: String,
      enum: ['temple', 'tour', 'restaurant', 'accommodation'],
      required: false,
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
      required: true,
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: 'City',
    },
  },
  { timestamps: true },
);

// Adding indexes for optimization
RestaurantSchema.index({ city: 1 });
RestaurantSchema.index({ type: 1 });
RestaurantSchema.index({ name: 1 });
RestaurantSchema.index({ rating: -1 });

const Restaurant = model('Restaurant', RestaurantSchema);

export default Restaurant;
