import { Schema, model } from 'mongoose';

const citySchema = new Schema({
  name: { type: String, required: true },
});

const countrySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: {
      url: String,
      key: String,
    },
    region: String,
    cities: [citySchema],
  },
  { timestamps: true },
);

const Country = model('Country', countrySchema);

export default Country;
