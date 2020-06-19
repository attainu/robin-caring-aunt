const express = require('express');
const routes = express.Router();
const userController = require('./controllers/userController');
const user_dtlController = require('./controllers/user_dtlController');

// User related routes
routes.get('/', userController.home);
routes.post('/register', userController.register);
routes.post('/login', userController.login);

// User Details Route
routes.post('/user-details',
userController.mustBeLoggedIn,
user_dtlController.insertUserDetail
);
routes.get('/home',
userController.mustBeLoggedIn,
user_dtlController.viewHome
);
routes.post('/logout', user_dtlController.logout);

module.exports = routes;