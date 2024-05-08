import { Schema, model } from 'mongoose';

const TourSchema = new Schema(
  {
    countryId: { type: String, required: false },
    name: { type: String, required: true },
    description: { type: String, required: true },
    textHebrew: { type: Boolean, required: false, default: false },
    price: { type: Number, required: false },
    priceDetail: [{ type: String, required: true }],
    durationDetail: [{ type: String, required: false }],
    contact: { type: Number, required: false },
    imageUrl: [{ type: String, required: true }],
    rating: { type: Number, required: true },
    review: { type: String, required: true },
    priority: { type: Number, required: false },
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
    languages: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
);

const Tour = model('Tour', TourSchema);

export default Tour;
