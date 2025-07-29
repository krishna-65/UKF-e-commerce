
// routes/productRoutes.js
import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
  getProductsOnSale,
  addProductReview,
  getProductStats,
  searchProducts
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middlewares/authUser.js';
// Assuming you have auth middleware

const router = express.Router();

// Public routes
router.get('/', protect, restrictTo('admin'), getAllProducts);
router.get('/search', protect, searchProducts);
router.get('/featured', protect, getFeaturedProducts);
router.get('/new-arrivals', protect, getNewArrivals);
router.get('/on-sale', protect, getProductsOnSale);
router.get('/stats', protect, getProductStats);
router.get('/:id', protect, getProductById);

// Protected routes (require authentication)
router.post('/:id/reviews', protect, addProductReview);

// Admin routes (require admin privileges)
router.post('/add', protect, restrictTo('admin'), createProduct);            // POST /api/products/add
router.put('/update/:id', protect, restrictTo('admin'), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

export default router;



