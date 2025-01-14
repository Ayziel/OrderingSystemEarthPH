const Order = require('../models/gCash'); // import the gCash model

// Create a new gCash entry
const createGcash = async (req, res) => {
    try {
        const { cash, userUid } = req.body;

        // Check if required fields are provided
        if (!cash || !userUid) {
            return res.status(400).json({ message: 'Cash and UserUid are required' });
        }

        // Create new entry
        const newOrder = new Order({
            cash,
            userUid
        });

        await newOrder.save(); // Save the new entry to the database
        res.status(201).json({ message: 'gCash entry created successfully', order: newOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Show gCash entry for a specific userUid
const showGcash = async (req, res) => {
    try {
        const { userUid } = req.params;

        // Find the gCash entry by userUid
        const order = await Order.findOne({ userUid });

        if (!order) {
            return res.status(404).json({ message: 'gCash entry not found' });
        }

        res.status(200).json({ order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update gCash entry for a specific userUid
const updateGcash = async (req, res) => {
    try {
        const { userUid } = req.params;
        const { cash } = req.body;

        // Check if the new cash value is provided
        if (!cash) {
            return res.status(400).json({ message: 'Cash value is required' });
        }

        // Find and update the gCash entry
        const updatedOrder = await Order.findOneAndUpdate(
            { userUid },
            { cash },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'gCash entry not found' });
        }

        res.status(200).json({ message: 'gCash entry updated successfully', order: updatedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Export all functions in the controller
module.exports = {
    createGcash,
    showGcash,
    updateGcash
};
