// routes/productRoutes.js
import express from 'express';
import {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductById
} from '../controllers/productController.js';

const router = express.Router();

router.post('/add', createProduct);            // POST /api/products/add
router.put('/update/:id', updateProduct);      // PUT  /api/products/update/:id
router.get('/', getAllProducts);               // GET  /api/products/
router.get('/:id', getProductById);            // GET  /api/products/:id

export default router;
