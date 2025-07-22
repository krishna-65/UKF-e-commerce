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
// Assuming you have auth middleware

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/on-sale', getProductsOnSale);
router.get('/stats', getProductStats);
router.get('/:id', getProductById);

// Protected routes (require authentication)
router.post('/:id/reviews',  addProductReview);

// Admin routes (require admin privileges)
router.post('/', createProduct);
router.put('/:id',  updateProduct);
router.delete('/:id', deleteProduct);

export default router;