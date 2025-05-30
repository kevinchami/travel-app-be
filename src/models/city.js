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
    description: { type: String, required: false },
    mapUrl: { type: String, required: false },
    available: { type: Boolean, required: false },
    tours: [{ type: Schema.Types.ObjectId, ref: 'Tour', required: false }],
    temples: [{ type: Schema.Types.ObjectId, ref: 'Temple', required: false }],
    hide: { type: Boolean, required: false },
    type: { type: String, required: false },
    restaurants: [
      { type: Schema.Types.ObjectId, ref: 'Restaurant', required: false },
    ],
    priority: { type: Number, required: false },
    accommodations: [
      { type: Schema.Types.ObjectId, ref: 'Accommodation', required: false },
    ], // Reference to the Accommodation model
    country: {
      type: Schema.Types.ObjectId,
      ref: 'Country',
    },
    region: {
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false },
      latitudeDelta: { type: Number, required: false },
      longitudeDelta: { type: Number, required: false },
    },
    coordinates: {
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false },
    },
  },
  { timestamps: true },
);

const City = model('City', citySchema);

export default City;
