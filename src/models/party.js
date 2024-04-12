import { Schema, model } from 'mongoose';

const PartySchema = new Schema(
  {
    countryId: { type: String, required: false },
    name: { type: String, required: true },
    contact: { type: Number, required: true },
    imageUrl: [{ type: String, required: true }],
    location: { type: String, required: true },
    neighborhood: { type: String, required: false },
    mapsUrl: { type: String, required: true },
    webUrl: { type: String, required: true },
    priority: { type: Number, required: false },
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
  },
  { timestamps: true },
);

const Party = model('Party', PartySchema);

export default Party;
