import { Schema, model } from 'mongoose';
import { addHideFilterMiddleware } from '../middleware/autoHideFilter.js';

const PartySchema = new Schema(
  {
    countryId: { type: String, required: false }, //id 
    name: { type: String, required: true },
    contact: { type: Number, required: false },
    imageUrl: [{ type: String, required: true }],
    location: { type: String, required: true },
    neighborhood: { type: String, required: false },
    hide: {type: Boolean, required: false},
    mapsUrl: { type: String, required: true },
    webUrl: { type: String, required: true },
    priority: { type: Number, required: false },
    highlighted: { type: Boolean, required: false, default: false },
    street: { type: String, required: true },
    category: {
      type: String,
      enum: ['temple', 'tour', 'restaurant', 'accommodation', 'party'],
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
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

addHideFilterMiddleware(PartySchema);

const Party = model('Party', PartySchema);

export default Party;
