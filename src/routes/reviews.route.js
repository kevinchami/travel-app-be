import express from 'express';
import { reviewController } from '../controllers/index.js';
import { safe } from '../utils/error-handling.js';

const router = express.Router();

router.post('/addReview', safe(reviewController.addReview));
router.delete('/deleteReview/:reviewId', safe(reviewController.deleteReview));
router.get('/getReviews', safe(reviewController.getReviews));
router.get(
  '/getReviewsByUser/:userId',
  safe(reviewController.getReviewsByUser),
);
router.get('/getReview/:reviewId', safe(reviewController.getReviewById));
router.get(
  '/getReviewsByPlace/:place',
  safe(reviewController.getReviewsByPlaceId),
);
router.get(
  '/getReviewsLengthByPlace/:place',
  safe(reviewController.getReviewsLengthByPlaceId),
);
router.put('/updatereview/:reviewId', safe(reviewController.updateReview));
router.get(
  '/calculateAverageRating/:placeId',
  safe(reviewController.calculateAverageRating),
);

export default router;
