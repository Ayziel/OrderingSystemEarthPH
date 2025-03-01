const express = require('express');
const router = express.Router();
const { getStores, createStore, updateStore, deleteStore } = require('../controller/storeController');

// Route to get all stores
router.get('/getStores', getStores);

// Route to create or update a store
router.post('/createStore', createStore);

router.put('/updateStore', updateStore);

router.delete('/deleteStore/:id', deleteStore);

module.exports = router;
