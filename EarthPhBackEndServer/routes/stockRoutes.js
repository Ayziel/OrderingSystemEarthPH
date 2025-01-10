const express = require('express');
const router = express.Router();
const StockController = require('../controllers/stockController');
// Route to get all stock records
router.get('/getStock', StockController.getStock);

// Route to create new stock
router.post('/createStock', StockController.createStock);

// Route to update stock
router.put('/updateStock', StockController.updateStock);

module.exports = router;
