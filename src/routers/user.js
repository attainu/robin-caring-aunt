import express from 'express';
import auth from '../middlewares/auth';
import upload from '../utils/multerConfig';
import { check, validationResult } from 'express-validator';
import { signup, login, logout, logoutAll, 
         stats, userProfile, getAvatar,
         deleteAvatar, deleteUserProfile,
         updateUserProfile, multerErrHandler,
         uploadAvatar } from '../controllers/userController';

const router = express.Router();

/* 
LOGIN AND SIGNUP ARE PUBLIC ROUTES
*/

// Sign Up  
router.post('/users', [
  check('name', 'Name should be atleast 4 char').isLength({ min: 4 }),
  check('email', 'Email should be correct format').isEmail(),
  check('password', 'Password should be atleast 8 char').isLength({ min: 8 }),
  check('contact', 'Contact Number should be 10 digits').isMobilePhone()
], signup);

// Log In 
router.post('/users/login', [
  check('email', 'Email is required').isEmail(),
  check('password', 'Password should be atleast 8 char').isLength({ min: 8 }),
], login);

// Log Out
router.post('/users/logout', auth, logout);

// Log out from every device 
router.post('/users/logoutAll', auth, logoutAll);

// upload Profile Picture
router.post('/users/me/avatar', auth, upload.single('avatar'), uploadAvatar, multerErrHandler);

// Get Profile Picture   
router.get('/users/me/avatar', auth, getAvatar);

// User profile
router.get('/users/me', auth, userProfile);

// Get route to view cycle stats
router.get('/users/me/cycle-stats', auth, stats);

// Update profile
router.patch('/users/me', auth, updateUserProfile);

// Delete user profile    
router.delete('/users/me', auth, deleteUserProfile);

// Delete profile picture
router.delete('/users/me/avatar', auth, deleteAvatar);

export default router;