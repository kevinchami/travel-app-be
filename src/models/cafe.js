import { Schema, model } from 'mongoose';

const CafeSchema = new Schema(
  {
    countryId: { type: String, required: false },
    name: { type: String, required: true },
    contact: { type: Number, required: false },
    textHebrew: { type: Boolean, required: false, default: false },
    imageUrl: [{ type: String, required: true }],
    isCoffee: { type: Boolean, required: true },
    menuUrl: { type: String, required: true },
    personalOpinion: { type: String, required: false },
    mapsUrl: { type: String, required: true },
    kosherBoolean: { type: Boolean, required: true },
    bookingNeeded: { type: Boolean, required: false, default: false },
    priority: { type: Number, required: false },
    category: {
      type: String,
      enum: ['temple', 'tour', 'restaurant', 'accommodation', 'cafe'],
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

const Cafe = model('Cafe', CafeSchema, 'cafes');

export default Cafe;
