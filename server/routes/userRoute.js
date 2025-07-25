import express from 'express';
import { forgotPassword, getAdminDashboardStats, getProfile, getUsers, isAuth, login, logout, register, updatePicture, updateProfile } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.put('/update/:id',updateProfile)
userRouter.patch('/updatePicture/:id',updatePicture)
userRouter.get('/is-auth', authUser, isAuth)
userRouter.get('/logout', authUser, logout)
userRouter.get('/profile/:id', getProfile)
userRouter.post('/forgot-password', forgotPassword)
userRouter.get('/admin-dashboard',  getAdminDashboardStats)
userRouter.get('/getuser', getUsers)
export default userRouter