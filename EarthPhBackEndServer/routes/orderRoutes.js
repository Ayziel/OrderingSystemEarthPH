const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');

router.get('/getOrders', orderController.getOrders); // Ensure this matches the frontend fetch
router.post('/createOrder', orderController.createOrder);
router.put('/updateOrder/:id', orderController.updateOrder);
module.exports = router;
