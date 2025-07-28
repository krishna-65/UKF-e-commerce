// routes/orderRoutes.js
import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getUserOrders,
  addTrackingInfo,
  getUserOrdersNoPagination,
  getAllOrdersNoPagination
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middlewares/authUser.js';


const router = express.Router();

// User routes
router.post('/', createOrder);
router.get('/my-orders',protect,  getUserOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

// Admin routes
router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/tracking',  addTrackingInfo);

//No Pagination routes
router.get('/orders/user', protect,restrictTo("user","admin"), getUserOrdersNoPagination);
router.get('/orders/allorders',protect,restrictTo("user","admin"), getAllOrdersNoPagination);

export default router;




// import express from 'express';
// import authUser from '../middlewares/authUser.js';
// import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderStripe } from '../controllers/orderController.js';
// import authSeller from '../middlewares/authSeller.js';

// const orderRouter = express.Router();

// orderRouter.post('/cod', authUser, placeOrderCOD)
// orderRouter.get('/user', authUser, getUserOrders)
// orderRouter.get('/seller', authSeller, getAllOrders)
// orderRouter.post('/stripe', authUser, placeOrderStripe)

// export default orderRouter;