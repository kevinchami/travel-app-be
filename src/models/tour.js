import { Schema, model } from 'mongoose';

const TourSchema = new Schema(
  {
    countryId: { type: String, required: false },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    contact: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    rating: { type: Number, required: true },
    review: { type: String, required: true },
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
