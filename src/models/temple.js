import { Schema, model } from 'mongoose';
import { addHideFilterMiddleware } from '../middleware/autoHideFilter.js';

const TempleSchema = new Schema(
  {
    countryId: { type: String, required: false },
    name: { type: String, required: true },
    contact: { type: Number, required: false },
    email: { type: String, required: false },
    webUrl: { type: String, required: false },
    imageUrl: [{ type: String, required: true }],
    location: { type: String, required: true },
    hide: { type: Boolean, required: false },
    neighborhood: { type: String, required: false },
    verifiedByHuman: { type: Boolean, required: false },
    mapsUrl: { type: String, required: false },
    shabbatfood: { type: Boolean, required: false },
    priority: { type: Number, required: false },
    category: {
      type: String,
      enum: ['temple', 'tour', 'restaurant', 'accommodation'],
      required: false,
      default: 'temple',
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

addHideFilterMiddleware(TempleSchema);

const Temple = model('Temple', TempleSchema);

export default Temple;
