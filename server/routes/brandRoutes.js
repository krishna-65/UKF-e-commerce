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


const router = express.Router();

// Public routes
router.get('/', getAllBrands);
router.get('/featured', getFeaturedBrands);
router.get('/with-products', getBrandsWithProducts);
router.get('/:id', getBrandById);

// Admin routes
router.post('/',   createBrand);
router.put('/:id',  updateBrand);
router.delete('/:id',   deleteBrand);

export default router;