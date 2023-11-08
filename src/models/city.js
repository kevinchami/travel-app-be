import { Schema, model } from 'mongoose';

const tourSchema = new Schema({
  name: { type: String, required: true },
});

const templeSchema = new Schema({
  name: { type: String, required: true },
});

const restaurantSchema = new Schema({
  name: { type: String, required: true },
});

const accommodationSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['apartment', 'hotel', 'hostel'],
    required: true,
  },
});

const citySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    tours: [tourSchema],
    temples: [templeSchema],
    restaurants: [restaurantSchema],
    accommodations: [{ type: Schema.Types.ObjectId, ref: 'Accommodation' }], // Reference to the Accommodation model
    country: {
      type: Schema.Types.ObjectId,
      ref: 'Country',
    },
  },
  { timestamps: true },
);

const City = model('City', citySchema);

export default City;
