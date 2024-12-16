const StoreModel = require('../models/storeModel');

// Controller to get all stores
async function getStores(req, res) {
  console.log('GET /getStores route hit');

  try {
    const stores = await StoreModel.find({});
    res.json({ stores });
  } catch (err) {
    console.error('Error fetching stores:', err);
    res.status(500).json({ message: 'Error fetching stores', error: err });
  }
}

// Controller to create or update a store
async function createOrUpdateStore(req, res) {
  console.log('Request Body:', req.body);

  const { storeId, name, firstName, lastName, address, phone, email, status } = req.body;

  // If storeId is provided, it means we're updating an existing store
  try {
    let store;
    if (storeId) {
      // Check if the store exists
      store = await StoreModel.findById(storeId);
      if (!store) {
        return res.status(404).json({ message: 'Store not found' });
      }

      // Update store fields
      store.name = name || store.name;
      store.firstName = firstName || store.firstName;
      store.lastName = lastName || store.lastName;
      store.address = address || store.address;
      store.phone = phone || store.phone;
      store.email = email || store.email;
      store.status = status || store.status;

      await store.save();
      return res.json({ message: 'Store updated successfully', store });
    }

    // If storeId is not provided, create a new store
    store = new StoreModel({
      name,
      firstName,
      lastName,
      address,
      phone,
      email,
      status
    });

    await store.save();
    res.json({ message: 'Store created successfully', store });
  } catch (err) {
    console.error('Error creating or updating store:', err);
    res.status(500).json({ message: 'Error creating or updating store', error: err });
  }
}

module.exports = { getStores, createOrUpdateStore };
