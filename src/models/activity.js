import { Schema, model } from 'mongoose';

const ActivitySchema = new Schema(
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
    priority: { type: Number, required: false },
    webUrl: { type: String, required: true },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    category: {
      type: String,
      required: false,
    },
    location: { type: String, required: true },
    neighborhood: { type: String, required: false },
    street: { type: String, required: false },
    city: {
      type: Schema.Types.ObjectId,
      ref: 'City',
      required: true,
    },
    languages: {
      type: [String],
      required: false,
    },
  },
  { timestamps: true },
);

const Activity = model('Activity', ActivitySchema);

export default Activity;
