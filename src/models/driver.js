// models/driver.js

import { Schema, model } from 'mongoose';

const DriverSchema = new Schema(
  {
    name: { type: String, required: true },
    contact: { type: Number, required: false },
    imageUrl: { type: String, required: false },
    vehicleType: {
      type: String,
      enum: ['car', 'motorcycle', 'bicycle'],
      required: false,
    },
    price: { type: Number, required: false },
    priceShow: { type: Boolean, required: false, default: false },
    licensePlate: { type: String, required: false },
    availability: { type: Boolean, required: false },
    verificated: { type: Boolean, required: false },
    languages: {
      type: [String],
      required: false,
    },
    maxCapacity: { type: Number, required: false }, // New field for maximum capacity of people
    city: {
      type: Schema.Types.ObjectId,
      ref: 'City',
    },
  },
  { timestamps: true },
);

const Driver = model('Driver', DriverSchema);

export default Driver;
