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

// Controller to create a new store
async function createStore(req, res) {
  console.log('Request Body (Create):', req.body);

  const { storeName, firstName, lastName, storeAddress, phoneNumber, email, status, uid, tin, guid, area } = req.body;

  try {
    // Create a new store instance
    const newStore = new StoreModel({
      name: storeName,
      firstName,
      lastName,
      address: storeAddress,
      phone: phoneNumber,
      email,
      status,
      uid,
      tin,
      guid,
      area,
    });

    await newStore.save();
    res.json({ message: 'Store created successfully', store: newStore });
  } catch (err) {
    console.error('Error creating store:', err);
    res.status(500).json({ message: 'Error creating store', error: err });
  }
}

// Controller to update an existing store
async function updateStore(req, res) {
  console.log('Request Body (Update):', req.body);

  const { storeId, storeName, firstName, lastName, storeAddress, phoneNumber, email, status, tin, guid, area } = req.body;

  if (!storeId) {
    return res.status(400).json({ message: 'Store ID is required for updating' });
  }

  try {
    // Find store by ID
    const store = await StoreModel.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Update store fields
    store.name = storeName || store.name;
    store.firstName = firstName || store.firstName;
    store.lastName = lastName || store.lastName;
    store.address = storeAddress || store.address;
    store.phone = phoneNumber || store.phone;
    store.email = email || store.email;
    store.status = status || store.status;
    store.tin = tin || store.tin;
    store.guid = guid || store.guid;
    store.area = area || store.area;

    await store.save();
    res.json({ message: 'Store updated successfully', store });
  } catch (err) {
    console.error('Error updating store:', err);
    res.status(500).json({ message: 'Error updating store', error: err });
  }
}

// Controller to delete a store
async function deleteStore(req, res) {
  console.log('DELETE /deleteStore/:id route hit');

  const { id } = req.params;

  try {
    const deletedStore = await StoreModel.findByIdAndDelete(id);

    if (!deletedStore) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.json({
      message: 'Store deleted successfully',
      store: deletedStore
    });
  } catch (err) {
    console.error('Error deleting store:', err);
    res.status(500).json({ message: 'Error deleting store', error: err });
  }
}

module.exports = { getStores, createStore, updateStore, deleteStore };
