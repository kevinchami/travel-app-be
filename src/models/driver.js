// models/driver.js

import { Schema, model } from 'mongoose';
import { addHideFilterMiddleware } from '../middleware/autoHideFilter.js';

const DriverSchema = new Schema(
  {
    countryId: { type: String, required: false },
    name: { type: String, required: true },
    contact: { type: Number, required: true },
    imageUrl: [{ type: String, required: true }],
    price: { type: Number, required: false },
    priceShow: { type: Boolean, required: false, default: false },
    licensePlate: { type: String, required: false },
    availability: { type: Boolean, required: false },
    hide: { type: Boolean, required: false },
    verificated: { type: Boolean, required: false },
    priority: { type: Number, required: false },
    highlighted: { type: Boolean, required: false, default: false },
    languages: {
      type: [String],
      required: false,
    },
    maxCapacity: { type: Number, required: false }, // New field for maximum capacity of people
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

addHideFilterMiddleware(DriverSchema);

const Driver = model('Driver', DriverSchema);

export default Driver;
