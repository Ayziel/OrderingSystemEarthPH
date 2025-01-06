const Order = require('../models/orderModel'); // Ensure the path is correct
exports.createOrder = async (req, res) => {
    try {
        const orderData = req.body; // This should be the full data object you sent from the frontend

        // Validate required fields
        if (!orderData.agentName || !orderData.teamLeaderName || !orderData.area || !orderData.products) {
            return res.status(400).json({ message: 'Missing required fields: agentName, teamLeaderName, area,  and products.' });
        }

        // Validate paymentImage for 'credit' payment mode
        if (orderData.paymentMode === 'credit' && (!orderData.paymentImage || orderData.paymentImage === 'noImageYet')) {
            return res.status(400).json({ message: 'Payment image is required for GCash payment.' });
        }

        // Parse listPrice and totalAmount
// Ensure the data is parsed correctly regardless of whether it's a number or string
                let listPrice = typeof orderData.listPrice === 'string' 
                    ? parseFloat(orderData.listPrice.replace('₱', '').replace(',', '')) 
                    : orderData.listPrice || 0;

                let totalAmount = typeof orderData.totalAmount === 'string' 
                    ? parseFloat(orderData.totalAmount.replace('₱', '').replace(',', '')) 
                    : orderData.totalAmount || 0;

                let totalItems = parseInt(orderData.totalItems) || 0;  // Ensure totalItems is an integer

                // Log the parsed values for debugging
                console.log('Parsed values:', listPrice, totalAmount, totalItems);


        // Handle products array and default description
        const updatedProducts = orderData.products.map(product => ({
            ...product,
            description: product.description || 'No description available'  // Add default description if missing
        }));

        // Create a new order instance using the data from the frontend
        const newOrder = new Order({
            agentName: orderData.agentName,
            teamLeaderName: orderData.teamLeaderName,
            area: orderData.area,
            orderDate: new Date(orderData.orderDate),
            storeName: orderData.storeName,
            tin: orderData.tin,
            listPrice: listPrice,
            discount: parseFloat(orderData.discount) || 0,
            totalItems: totalItems,
            totalAmount: totalAmount,
            paymentMode: orderData.paymentMode,
            paymentImage: orderData.paymentImage || 'noImageYet',  // Ensure paymentImage is set
            remarks: orderData.remarks,
            products: updatedProducts
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
