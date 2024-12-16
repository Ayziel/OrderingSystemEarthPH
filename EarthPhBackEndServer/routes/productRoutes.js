const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');

// Route to get all products
router.get('/getProduct', productController.getProduct);

// Route to create a new product
router.post('/createProduct', productController.createProduct);

// Route to update a product
router.put('/updateProduct', productController.updateProduct);  // Add this line for the PUT request

module.exports = router;
