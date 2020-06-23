const express = require('express')
const router = new express.Router();
const auth = require('../middleware/auth')
const control = require('../controllers/userController')

/* 
PUBLIC ROUTES WERE LOGIN AND SIGNUP ROUTE
*/

// Sign Up 
router.post('/users', control.signup);

// Log In 
router.post('/users/login', control.login);

// Log Out
router.post('/users/logout', auth, control.logout);

// Log out from every device
router.post('/users/logoutAll', auth, control.logoutAll);

// User profile
router.get('/users/me', auth , control.userProfile);

// Update profile
router.patch('/users/me', auth, control.updateUserProfile);

// Delete user profile
router.delete('/users/me', auth, control.deleteUserProfile)

module.exports = router;