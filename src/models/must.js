// models/must.js

import { Schema, model } from 'mongoose';
import { addHideFilterMiddleware } from '../middleware/autoHideFilter.js';

const MustSchema = new Schema(
  {
    countryId: { type: String, required: true }, //try
    description: { type: String, required: false },
    name: { type: String, required: true },
    location: { type: String, required: false },
    contact: { type: Number, required: false },
    imageUrl: [{ type: String, required: false }],
    hide: {type: Boolean, required: false},
    hours: { type: String, required: false },
    category: { type: String, required: false },
    mapsUrl: { type: String, required: false },
    kosherBoolean: { type: Boolean, required: false },
    showKosher: { type: Boolean, required: true, default: false },
    bookingNeeded: { type: Boolean, required: false, default: false },
    priority: { type: Number, required: false },
    highlighted: { type: Boolean, required: false, default: false },
    type: {
      type: String,
      required: false,
    },
    languages: {
      type: [String],
      required: false,
    },
    maxCapacity: { type: Number, required: false },
    city: {
      type: Schema.Types.ObjectId,
      ref: 'City',
    },
    coordinates: {
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false },
    },
  },
  { timestamps: true },
);

addHideFilterMiddleware(MustSchema);


const Must = model('Must', MustSchema);

export default Must;
