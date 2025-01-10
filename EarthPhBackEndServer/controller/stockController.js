const StockModel = require('../models/stockModel');

// Controller to get all stock records
async function getStock(req, res) {
    console.log('GET /getStock route hit');

    try {
        const stocks = await StockModel.find({});  // Fetch all stock records
        console.log("Fetched Stocks:", stocks);
        res.json({ stocks });  // Return stocks as JSON
    } catch (err) {
        console.error('Error fetching stocks:', err);
        res.status(500).json({ message: 'Error fetching stocks', error: err });
    }
}

// Controller to create a new stock record
async function createStock(req, res) {
    console.log('Request Body:', req.body); // Log incoming request body

    const { uid, parent_uid, store_name, product_name, quantity } = req.body;

    // Create a new stock instance
    const newStock = new StockModel({
        uid,
        parent_uid,
        store_name,
        product_name,
        quantity,
    });

    console.log('New Stock:', newStock);

    try {
        // Save the new stock to the database
        await newStock.save();
        res.json({ 
            message: 'Stock created successfully', 
            stock: newStock 
        });
    } catch (err) {
        console.error('Error creating stock:', err);
        res.status(500).json({ message: 'Error creating stock', error: err });
    }
}

// Controller to update an existing stock record
async function updateStock(req, res) {
    console.log('PUT /updateStock route hit');

    const { uid, parent_uid, product_uid, store_name, product_name, quantity } = req.body;

    try {
        // Find the stock record by `uid` (or another identifier) and update it
        const updatedStock = await StockModel.findOneAndUpdate(
            { uid },  // Search criteria (e.g., stock uid)
            { 
                parent_uid,
                product_uid,
                store_name,
                product_name,
                quantity,
            },
            { new: true }  // Return the updated document
        );

        if (!updatedStock) {
            return res.status(404).json({ message: 'Stock not found' });
        }

        res.json({ 
            message: 'Stock updated successfully', 
            stock: updatedStock 
        });
    } catch (err) {
        console.error('Error updating stock:', err);
        res.status(500).json({ message: 'Error updating stock', error: err });
    }
}

module.exports = { getStock, createStock, updateStock };
