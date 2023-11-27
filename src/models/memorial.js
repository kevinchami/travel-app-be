import { Schema, model } from 'mongoose';

const MemorialSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    imageUrl: [
      {
        type: String,
        required: true,
        default:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png',
      },
    ],
    location: { type: String, required: true },
  },
  { timestamps: true },
);

const Memorial = model('Memorial', MemorialSchema);

export default Memorial;
