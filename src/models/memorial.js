import { Schema, model } from 'mongoose';

const MemorialSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: false },
    imageUrl: {
      type: String,
      required: false,
      default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png',
    },
    location: { type: String, required: false },
  },
  { timestamps: true },
);

const Memorial = model('Memorial', MemorialSchema);

export default Memorial;
