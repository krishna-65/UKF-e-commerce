// routes/brandRoutes.js
import express from 'express';
import {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  getFeaturedBrands,
  getBrandsWithProducts
} from '../controllers/brandController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllBrands);
router.get('/featured', getFeaturedBrands);
router.get('/with-products', getBrandsWithProducts);
router.get('/:id', getBrandById);

// Admin routes
router.post('/', protect, admin, createBrand);
router.put('/:id', protect, admin, updateBrand);
router.delete('/:id', protect, admin, deleteBrand);

export default router;