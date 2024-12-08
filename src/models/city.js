import { Schema, model } from 'mongoose';

/*
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
*/

const citySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    mapUrl: {type: String, required: false},
    available: { type: Boolean, required: false },
    tours: [{ type: Schema.Types.ObjectId, ref: 'Tour' }],
    temples: [{ type: Schema.Types.ObjectId, ref: 'Temple' }],
    restaurants: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }],
    priority: { type: Number, required: false },
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
