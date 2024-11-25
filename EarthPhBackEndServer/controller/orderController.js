const Order = require('../models/orderModel');

// Create Order
exports.createOrder = async (req, res) => {
    try {
        const orderData = req.body; // This should be the full data object you sent from the frontend

        // Create a new order instance using the data from the frontend
        const newOrder = new Order({
            agentName: orderData.agentName,
            teamLeaderName: orderData.teamLeaderName,
            area: orderData.area,
            orderDate: new Date(orderData.orderDate),
            storeName: orderData.storeName,
            houseAddress: orderData.houseAddress,
            townProvince: orderData.townProvince,
            storeCode: orderData.storeCode,
            tin: orderData.tin,
            listPrice: parseFloat(orderData.listPrice.replace('₱', '').replace(',', '')),
            discount: parseFloat(orderData.discount) || 0,
            totalItems: parseInt(orderData.totalItems),
            totalAmount: parseFloat(orderData.totalAmount.replace('₱', '').replace(',', '')),
            paymentMode: orderData.paymentMode,
            paymentImage: orderData.paymentImage,
            remarks: orderData.remarks,
            products: orderData.products // Handle products array
        });

        // Save the order in the database
        const savedOrder = await newOrder.save();

        // Return success response
        res.status(201).json({
            message: 'Order created successfully',
            order: savedOrder
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error creating order',
            error: error.message
        });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('products');  // Use .populate to fetch the products related to the order
        res.status(200).json(orders);  // Send the orders data as a response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};
