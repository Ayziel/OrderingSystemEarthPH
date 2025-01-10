const express = require('express');
const router = express.Router();
const { getStores, createOrUpdateStore } = require('../controller/storeController');

// Route to get all stores
router.get('/getStores', getStores);

// Route to create or update a store
router.post('/createOrUpdateStore', createOrUpdateStore);

module.exports = router;
