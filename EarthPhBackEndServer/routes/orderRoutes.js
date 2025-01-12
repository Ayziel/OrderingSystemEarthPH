const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');

router.get('/getOrders', orderController.getOrders); // Ensure this matches the frontend fetch

// Change this line in your orderRoutes.js
router.put('/updateOrders/:orderId', orderController.updateOrders); // Expect orderId in the URL


router.post('/createOrder', orderController.createOrder);

module.exports = router;
