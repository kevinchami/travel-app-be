import { Schema, model } from 'mongoose';

const TempleSchema = new Schema(
  {
    countryId: { type: String, required: false },
    name: { type: String, required: true },
    contact: { type: Number, required: false },
    email: {type: String, required: false},
    imageUrl: [{ type: String, required: true }],
    location: { type: String, required: true },
    neighborhood: { type: String, required: false },
    mapsUrl: { type: String, required: false },
    shabbatfood: { type: Boolean, required: false },
    priority: { type: Number, required: false },
    category: {
      type: String,
      enum: ['temple', 'tour', 'restaurant', 'accommodation'],
      required: false,
    },
    type: {
      type: String,
      // enum: ['sefaradi', 'ashkenazi', 'chabbad'],
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
