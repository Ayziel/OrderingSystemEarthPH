const Order = require('../models/orderModel'); // Ensure the path is correct

exports.createOrder = async (req, res) => {
    try {
        const orderData = req.body; // Full data object sent from the frontend

        // Validate required fields
        if (!orderData.agentName || !orderData.teamLeaderName || !orderData.area || !orderData.products || !orderData.storeUid || !orderData.userUid) {
            return res.status(400).json({ message: 'Missing required fields: agentName, teamLeaderName, area, products, storeUid, and userUid.' });
        }

        // Validate paymentImage for 'credit' payment mode
        if (orderData.paymentMode === 'credit' && (!orderData.paymentImage || orderData.paymentImage === 'noImageYet')) {
            return res.status(400).json({ message: 'Payment image is required for GCash payment.' });
        }

        // Parse listPrice and totalAmount if needed
        let listPrice = typeof orderData.listPrice === 'string' 
            ? parseFloat(orderData.listPrice.replace('₱', '').replace(',', '')) 
            : orderData.listPrice || 0;

        let totalAmount = typeof orderData.totalAmount === 'string' 
            ? parseFloat(orderData.totalAmount.replace('₱', '').replace(',', '')) 
            : orderData.totalAmount || 0;

        let totalItems = parseInt(orderData.totalItems) || 0;  // Ensure totalItems is an integer

        // Use products as they are provided
        const products = orderData.products.map(product => ({
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            total: product.total,
            description: product.description || 'No description available',
            product_uid: product.product_uid // Ensure product_uid is included
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
            totalItems: totalItems,
            totalAmount: totalAmount,
            paymentMode: orderData.paymentMode,
            paymentImage: orderData.paymentImage || 'noImageYet',  // Ensure paymentImage is set
            remarks: orderData.remarks,
            products: products,
            uid: orderData.uid,
            storeUid: orderData.storeUid,
            userUid: orderData.userUid,
            status: 'Pending' // Set default status to 'Pending'
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
        const { status, storeName, agentName, teamLeaderName, area, products, totalAmount, orderDate, ...otherFields } = req.body;
        const { orderId } = req.params; // Assuming the order ID is passed in the URL as a parameter

        // Validate incoming fields
        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required.' });
        }

        // Create the update object with only the fields that are provided
        const updateData = {};
        if (status) updateData.status = status;
        if (storeName) updateData.storeName = storeName;
        if (agentName) updateData.agentName = agentName;
        if (teamLeaderName) updateData.teamLeaderName = teamLeaderName;
        if (area) updateData.area = area;
        if (products) {
            // Assuming products array includes `name`, `quantity`, `price`, and other necessary details
            updateData.products = products.map(product => {
                const discountedPrice = product.price * (1 - (product.discount / 100));
                const total = discountedPrice * product.quantity;
                return { 
                    ...product,
                    price: discountedPrice,
                    total: total,
                };
            });
        }
        if (totalAmount) updateData.totalAmount = totalAmount;
        if (orderDate) updateData.orderDate = new Date(orderDate);

        // Update the order directly using the orderId (assumes `orderId` is unique and exists)
        const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Failed to update order', error });
    }
};

