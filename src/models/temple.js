import { Schema, model } from 'mongoose';

const TempleSchema = new Schema(
  {
    countryId: { type: String, required: false },
    name: { type: String, required: true },
    contact: { type: Number, required: true },
    imageUrl: [{ type: String, required: true }],
    location: { type: String, required: true },
    mapsUrl: { type: String, required: true },
    shabbatfood: { type: Boolean, required: false },
    priority: { type: Number, required: false },
    category: {
      type: String,
      enum: ['temple', 'tour', 'restaurant', 'accommodation'],
      required: false,
    },
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
