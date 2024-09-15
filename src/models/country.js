import { Schema, model } from 'mongoose';
import City from './city.js';

const countrySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: Number, required: false },
    available: { type: Boolean, required: false },
    flagUrl: { type: String, required: false },
    image: {
      url: String,
      key: String,
    },
    region: String,
    cities: [{ type: Schema.Types.ObjectId, ref: 'City' }], // Reference to the City model
  },
  { timestamps: true },
);

const Country = model('Country', countrySchema);

export default Country;
