const express = require('express');
const auth = require('../middlewares/auth');
const upload = require('../utils/multerConfig');
const { check, validationResult } = require('express-validator');
const { signup, login, logout, logoutAll,
  userProfile, getAvatar, deleteAvatar, deleteUserProfile,
  updateUserProfile, multerErrHandler, uploadAvatar
} = require('../controllers/userController');

const router = express.Router();
/* 
PUBLIC ROUTES WERE LOGIN AND SIGNUP ROUTE
*/

// Sign Up  name email age password contact
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

// Update profile
router.patch('/users/me', auth, updateUserProfile);

// Delete user profile    
router.delete('/users/me', auth, deleteUserProfile);

// Delete profile picture
router.delete('/users/me/avatar', auth, deleteAvatar);

module.exports = router;