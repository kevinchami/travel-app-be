import { Schema, model } from 'mongoose';

const AccomodationSchema = new Schema(
  {
    countryId: { type: String, required: false },
    name: { type: String, required: true },
    description: { type: String, required: true },
    textHebrew: { type: Boolean, required: false, default: false },
    price: { type: Number, required: true },
    guests: { type: Number, required: false },
    priceDetail: { type: String, required: false },
    priceShow: { type: Boolean, required: false, default: true },
    webUrl: { type: String, required: false },
    mapsUrl: { type: String, required: false },
    contact: { type: Number, required: true },
    imageUrl: [{ type: String, required: true }],
    priority: { type: Number, required: false },
    languages: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      enum: ['temple', 'tour', 'restaurant', 'accommodation'],
      required: false,
    },
    //rating: { type: Number, required: false },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    location: { type: String, required: true },
    neigborhood: { type: String, required: false },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    type: {
      type: String,
      enum: ['apartment', 'hotel', 'hostel'],
      required: true,
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: 'City',
    },
    facilities: [
      {
        wifi: { type: Boolean, default: true },
      },
      {
        parking: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true },
);

const Accomodation = model('Accomodation', AccomodationSchema);

export default Accomodation;
