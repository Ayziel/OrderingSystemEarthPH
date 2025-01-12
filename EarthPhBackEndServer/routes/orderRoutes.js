const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');

router.get('/getOrders', orderController.getOrders); // Ensure this matches the frontend fetch

router.put('/updateOrders', orderController.updateOrders);

router.post('/createOrder', orderController.createOrder);

module.exports = router;
