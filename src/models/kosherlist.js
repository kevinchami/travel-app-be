import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const listSchema = new Schema(
  {
    name: { type: String, required: false },
    description: { type: String, required: false },
    url: { type: String, required: false },
    available: { type: Boolean, required: false },
    hide: { type: Boolean, required: false },
    country: {
      type: Schema.Types.ObjectId,
      ref: 'Country',
      required: false,
    },
  },
  { timestamps: true },
);

const KosherList = model('KosherList', listSchema);

export default KosherList;
