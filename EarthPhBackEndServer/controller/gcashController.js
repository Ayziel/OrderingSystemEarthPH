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


// Get all GCash records
exports.getAllGCash = async (req, res) => {
    try {
        // Fetch all GCash records
        const gcashRecords = await GCash.find();
        if (gcashRecords.length === 0) {
            return res.status(404).json({ message: 'No GCash records found.' });
        }

        return res.status(200).json({ message: 'GCash records found.', gcash: gcashRecords });
    } catch (error) {
        console.error('Error fetching all GCash records:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};


// Send GCash to another user
exports.sendGCash = async (req, res) => {
    try {
        const { senderUid, receiverUid, amount } = req.body;

        // Check for required fields
        if (!senderUid || !receiverUid || amount == null) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // Validate that the amount is a positive number
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount. It must be a positive number.' });
        }

        // Fetch the sender's GCash record
        const senderGCash = await GCash.findOne({ userUid: senderUid });
        if (!senderGCash) {
            return res.status(404).json({ message: 'Sender GCash record not found.' });
        }

        // Fetch the receiver's GCash record
        const receiverGCash = await GCash.findOne({ userUid: receiverUid });
        if (!receiverGCash) {
            return res.status(404).json({ message: 'Receiver GCash record not found.' });
        }

        // Ensure the sender has enough balance to send
        const senderBalance = parseFloat(senderGCash.cash);
        if (senderBalance < amount) {
            return res.status(400).json({ message: 'Insufficient funds in sender account.' });
        }

        // Deduct the amount from the sender's GCash
        senderGCash.cash = (senderBalance - amount).toString();
        await senderGCash.save();

        // Add the amount to the receiver's GCash
        const receiverBalance = parseFloat(receiverGCash.cash);
        receiverGCash.cash = (receiverBalance + amount).toString();
        await receiverGCash.save();

        return res.status(200).json({ 
            message: 'GCash successfully sent.',
            senderGCash,
            receiverGCash
        });
    } catch (error) {
        console.error('Error sending GCash:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
