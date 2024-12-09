const StoreModel = require('../models/storeModel');

// Controller to get all stores
async function getStores(req, res) {
  console.log('GET /getStores route hit');

  try {
    const stores = await StoreModel.find({}).populate('products');
    res.json({ stores });
  } catch (err) {
    console.error('Error fetching stores:', err);
    res.status(500).json({ message: 'Error fetching stores', error: err });
  }
}

// Controller to create a new store
async function createStore(req, res) {
  console.log('Request Body:', req.body);

  const { name, address, phone, email, products } = req.body;

  const newStore = new StoreModel({
    name,
    address,
    phone,
    email,
    products
  });

  try {
    await newStore.save();
    res.json({ message: 'Store created successfully', store: newStore });
  } catch (err) {
    console.error('Error creating store:', err);
    res.status(500).json({ message: 'Error creating store', error: err });
  }
}

module.exports = { getStores, createStore };
