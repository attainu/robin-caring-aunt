const express = require('express');
const routes = express.Router();
const userController = require('./controllers/userController');

routes.get('/', userController.home);
routes.post('/register', userController.register);
routes.post('/login', userController.login);
routes.post('/logout', userController.logout);

module.exports = routes;