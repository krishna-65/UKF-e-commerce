import express from 'express';
import {
  createAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/addressController.js';


const router = express.Router();

router.post('/',  createAddress);
router.get('/user/:userId', getUserAddresses);
router.put('/:id',  updateAddress);//addressId
router.delete('/:id',  deleteAddress);//addressId
router.patch('/:id/set-default/:userId', setDefaultAddress);

export default router;