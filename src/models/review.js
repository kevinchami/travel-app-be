import { Schema, model } from 'mongoose';

const reviewSchema = new Schema(
  {
    placeType: {
      type: String,
      required: false,
      enum: ['Restaurant', 'Accomodation', 'Tour'], // Adjust the options as needed
    },
    placeId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'placeType',
    },
    /*
    placeId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Restaurant',
    },
    */
    review: { type: String, required: true },
    rating: { type: String, required: true },
    user: {
      // type: Schema.Types.ObjectId,
      type: String,
      // ref: 'User',
    },
  },
  { timestamps: true },
);

const Review = model('Review', reviewSchema);

export default Review;
