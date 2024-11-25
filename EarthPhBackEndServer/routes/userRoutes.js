const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Route to get all users
router.get('/getUsers', userController.getUsers);

// Route to create a new user
router.post('/createUser', userController.createUser);

module.exports = router;
