const Order = require('../models/orderModel'); // Ensure the path is correct

exports.createOrder = async (req, res) => {
    try {
        const orderData = req.body; // This should be the full data object you sent from the frontend

        // Validate required fields
        if (!orderData.agentName || !orderData.teamLeaderName || !orderData.area || !orderData.products || !orderData.storeUid || !orderData.userUid) {
            return res.status(400).json({ message: 'Missing required fields: agentName, teamLeaderName, area, products, storeUid, and userUid.' });
        }

        // Validate paymentImage for 'credit' payment mode
        if (orderData.paymentMode === 'credit' && (!orderData.paymentImage || orderData.paymentImage === 'noImageYet')) {
            return res.status(400).json({ message: 'Payment image is required for GCash payment.' });
        }

        // Parse listPrice and totalAmount
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
        const updatedProducts = orderData.products.map(product => {
            // Apply discount to the price before calculating the total for each product
            const discountedPrice = product.price * (1 - (product.discount / 100));  // Discount applied as percentage
            const total = discountedPrice * product.quantity;

            return {
                ...product,
                price: discountedPrice,  // Set the discounted price for the product
                total: total,  // Set the total based on discounted price
                product_uid: product.product_uid  // Ensure product_uid is included
            };
        });

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
            products: updatedProducts,
            uid: orderData.uid,
            storeUid: orderData.storeUid, // CHANGE: Add storeUid
            userUid: orderData.userUid // CHANGE: Add userUid
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


// Controller function to update order
exports.updateOrders = async (req, res) => {
    try {
        const { store_name, product_name, agentName, teamLeaderName, area, products, totalAmount, status, listPrice, discount, totalItems, tin, orderDate } = req.body;

        // Find the existing order by a field other than uid (e.g., store_name or product_name)
        const existingOrder = await Order.findOne({ storeName: store_name, products: { $elemMatch: { name: product_name } } });

        if (!existingOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the fields using the data from the request
        existingOrder.agentName = agentName || existingOrder.agentName;
        existingOrder.teamLeaderName = teamLeaderName || existingOrder.teamLeaderName;
        existingOrder.area = area || existingOrder.area;
        existingOrder.products = products || existingOrder.products;
        existingOrder.totalAmount = totalAmount || existingOrder.totalAmount;
        existingOrder.status = status || existingOrder.status;
        existingOrder.listPrice = listPrice || existingOrder.listPrice;
        existingOrder.discount = discount || existingOrder.discount;
        existingOrder.totalItems = totalItems || existingOrder.totalItems;
        existingOrder.tin = tin || existingOrder.tin;
        existingOrder.orderDate = orderDate ? new Date(orderDate) : existingOrder.orderDate;

        // Handle products array and default description
        const updatedProducts = products.map(product => {
            const discountedPrice = product.price * (1 - (product.discount / 100));  // Apply discount to price
            const total = discountedPrice * product.quantity;

            return {
                ...product,
                price: discountedPrice,
                total: total,
                product_uid: product.product_uid  // Ensure product_uid is included
            };
        });

        existingOrder.products = updatedProducts;

        // Save the updated order
        const updatedOrder = await existingOrder.save();

        res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });

    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Failed to update order', error });
    }
};