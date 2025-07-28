import express from 'express';
import { forgotPassword, getAdminDashboardStats, getProfile, getUserNoPagination, getUsers, isAuth, login, logout, register, updatePicture, updateProfile } from '../controllers/userController.js';


const userRouter = express.Router();

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.put('/update/:id',updateProfile)
userRouter.patch('/updatePicture/:id',updatePicture)
userRouter.get('/is-auth',  isAuth)
userRouter.get('/logout', logout)
userRouter.get('/profile/:id', getProfile)
userRouter.post('/forgot-password', forgotPassword)
userRouter.get('/admin-dashboard',  getAdminDashboardStats)
userRouter.get('/getuser', getUsers)
userRouter.get('/getUserNoPagination',getUserNoPagination)
export default userRouter