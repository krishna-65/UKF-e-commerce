// routes/cartRoutes.js
import express from 'express';
import {
  addToCart,
  removeFromCart,
  getCart,
  updateCartItem,
  clearCart
} from '../controllers/cartController.js';


const router = express.Router();

// Protected routes (require authentication)
router.post('/:id',  addToCart);
router.delete('/:id', removeFromCart);
router.get('/:id',  getCart);
router.put('/:id',  updateCartItem);
router.delete('/:id/clear',  clearCart);

export default router;