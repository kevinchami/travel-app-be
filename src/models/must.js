// models/must.js

import { Schema, model } from 'mongoose';

const MustSchema = new Schema(
  {
    countryId: { type: String, required: true },
    description: { type: String, required: false },
    name: { type: String, required: true },
    location: { type: String, required: false },
    contact: { type: Number, required: false },
    imageUrl: [{ type: String, required: false }],
    hours: { type: String, required: false },
    category: { type: String, required: false },
    mapsUrl: { type: String, required: false },
    kosherBoolean: { type: Boolean, required: false },
    showKosher: { type: Boolean, required: true, default: false },
    bookingNeeded: { type: Boolean, required: false, default: false },
    priority: { type: Number, required: false },
    highlighted: { type: Boolean, required: false, default: false },
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

const Must = model('Must', MustSchema);

export default Must;
