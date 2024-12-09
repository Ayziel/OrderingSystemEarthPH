const express = require('express');
const router = express.Router();
const { getStores, createStore } = require('../controllers/storeController');

// Route to get all stores
router.get('/getStores', getStores);

// Route to create a new store
router.post('/createStore', createStore);

module.exports = router;
