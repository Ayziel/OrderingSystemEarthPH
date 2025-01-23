const express = require('express');
const router = express.Router();
const viewStoreController = require('../controller/viewStoreController');

// Route to get all stores or a specific store by UID
router.get('/getStores', viewStoreController.getStores);

// Route to create a new store
router.post('/createStore', viewStoreController.createStore);

// Route to update a store
router.put('/updateStore', viewStoreController.updateStore);

// Route to delete a store
router.delete('/deleteStore', viewStoreController.deleteStore);

module.exports = router;
