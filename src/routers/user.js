const express = require('express')
const auth = require('../middlewares/auth')
const upload = require('../utils/multerConfig');
const control = require('../controllers/userController')

const router = express.Router();
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

// upload Profile Picture
router.post('/users/me/avatar', auth, upload.single('avatar'), control.uploadAvatar, control.multerErrHandler);

// Get Profile Picture
router.get('/users/me/avatar', auth, control.getAvatar)

// User profile
router.get('/users/me', auth , control.userProfile);

// Update profile
router.patch('/users/me', auth, control.updateUserProfile);

// Delete user profile
router.delete('/users/me', auth, control.deleteUserProfile)

// Delete profile picture
router.delete('/users/me/avatar', auth, control.deleteAvatar)



module.exports = router;