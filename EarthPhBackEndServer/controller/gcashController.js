const GCash = require('../models/gcashModel');

// Get GCash by userUid
exports.getGCashByUserUid = async (req, res) => {
    try {
        const { userUid } = req.params;

        const gcash = await GCash.findOne({ userUid });
        if (!gcash) {
            return res.status(404).json({ message: 'No GCash record found for this user.' });
        }

        return res.status(200).json({ message: 'GCash record found.', gcash });
    } catch (error) {
        console.error('Error fetching GCash:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

// Create a new GCash record
// Create a new GCash record
// Create a new GCash record
exports.createGCash = async (req, res) => {
    try {
        const { userUid, balance } = req.body;  // Accept the balance from the frontend

        if (balance == null) {
            return res.status(400).json({ message: 'Missing balance value.' });
        }

        const existingGCash = await GCash.findOne({ userUid });
        if (existingGCash) {
            return res.status(400).json({ message: 'GCash record already exists for this user.' });
        }

        // Create a new GCash record with the provided balance
        const newGCash = new GCash({
            cash: balance,  // Use the balance passed from the frontend
            userUid,
        });

        await newGCash.save();

        return res.status(201).json({ message: 'New GCash record created.', gcash: newGCash });
    } catch (error) {
        console.error('Error creating GCash:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};



// Update GCash by adding the order total to cash
exports.updateGCash = async (req, res) => {
    try {
        const { userUid, totalAmount } = req.body;

        if (!userUid || totalAmount == null) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const gcash = await GCash.findOne({ userUid });
        if (!gcash) {
            return res.status(404).json({ message: 'No GCash record found for this user.' });
        }

        // Ensure both values are numbers
        const currentCash = parseFloat(gcash.cash);
        const amountToAdd = parseFloat(totalAmount);

        if (isNaN(currentCash) || isNaN(amountToAdd)) {
            return res.status(400).json({ message: 'Invalid cash values provided.' });
        }

        gcash.cash = (currentCash + amountToAdd).toString();
        await gcash.save();

        return res.status(200).json({ message: 'GCash record updated.', gcash });
    } catch (error) {
        console.error('Error updating GCash:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
