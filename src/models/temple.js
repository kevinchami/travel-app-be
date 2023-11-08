import { Schema, model } from 'mongoose';

const TempleSchema = new Schema(
  {
    countryId: { type: String, required: false },
    name: { type: String, required: true },
    contact: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    location: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    type: {
      type: String,
      enum: ['sefaradi', 'ashkenazi', 'chabbad'],
      required: false,
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: 'City',
    },
    specifications: [
      {
        shabbatmeal: { type: Boolean, required: false },
      },
    ],
  },
  { timestamps: true },
);

const Temple = model('Temple', TempleSchema);

export default Temple;
