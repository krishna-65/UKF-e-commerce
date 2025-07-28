import express from 'express';
import {
  createReview,
  getReviewsByProduct,
  updateReview,
  getUserReviewForProduct,
  getTopReviews
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../middlewares/authUser.js';


const router = express.Router();

router.post('/:productId/:orderId', protect, restrictTo("user"), createReview);
router.get('/product/:productId', getReviewsByProduct);
router.get('/product/:productId/user', protect, getUserReviewForProduct);
router.put('/:reviewId', protect, updateReview);
router.get('/top', getTopReviews);

export default router;
