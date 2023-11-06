import { Schema, model } from 'mongoose';
const mongoose = require('mongoose');

const countrySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: {
      url: String,
      key: String,
    },
    region: String,
    cities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
      },
    ],
  },
  { timestamps: true },
);

const Country = model('Country', countrySchema);

export default Country;
