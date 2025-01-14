const Order = require('../models/gCash'); // import the model

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

module.exports = createGcash;
