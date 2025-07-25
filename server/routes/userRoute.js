import express from 'express';
import { getProfile, isAuth, login, logout, register, updateProfile } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.put('/update/:id',updateProfile)
userRouter.get('/is-auth', authUser, isAuth)
userRouter.get('/logout', authUser, logout)
userRouter.get('/profile/:id', getProfile)

export default userRouter