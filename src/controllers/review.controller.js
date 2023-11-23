import { reviewService } from '../services/index.js';

export const addReview = async (req, res) => {
  const reviewData = req.body;
  const review = await reviewService.addReview(reviewData);
  return res.status(201).json(review);
};

export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;
  const result = await reviewService.deleteReview(reviewId);
  return res.status(200).json({ message: 'Review deleted successfully' });
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getReviews();
    res.status(200).json(reviews);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await reviewService.getReviewsByUser(userId);
    res.status(200).json(reviews);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getReviewsByPlaceId = async (req, res) => {
  const { place } = req.params;
  console.log('params: ', req.params);
  console.log('place: ', place);

  const reviews = await reviewService.getReviewsByPlaceId(place);
  res.status(200).json(reviews);
};

export const getReviewById = async (req, res) => {
  const { reviewId } = req.params;
  const review = await reviewService.getReviewById(reviewId);
  res.status(200).json(review);
};

export const updateReview = async (req, res) => {
  const updatedReview = await reviewService.updateReview(
    req.params.reviewId,
    req.body,
  );
  res.status(200).json(updatedReview);
};
