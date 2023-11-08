import { Schema, model } from 'mongoose';
import City from './city.js';

const countrySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: {
      url: String,
      key: String,
    },
    region: String,
    // TODO i need to put here the cities? because i have a function getCitiesOfCountry in city modules.
    cities: [{ type: Schema.Types.ObjectId, ref: 'City' }], // Reference to the City model
  },
  { timestamps: true },
);

const Country = model('Country', countrySchema);

export default Country;