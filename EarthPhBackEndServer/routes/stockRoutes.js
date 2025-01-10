const express = require('express');
const router = express.Router();
const { getStock, createStock, updateStock } = require('../controllers/stockController');

// Route to get all stock records
router.get('/getStock', getStock);

// Route to create new stock
router.post('/createStock', createStock);

// Route to update stock
router.put('/updateStock', updateStock);

module.exports = router;
