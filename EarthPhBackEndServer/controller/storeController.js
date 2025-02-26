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

  const { storeId, storeName, firstName, lastName, storeAddress, phoneNumber, workPhone, email, status, uid, tin } = req.body;

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
      store.name = storeName || store.name;
      store.firstName = firstName || store.firstName;
      store.lastName = lastName || store.lastName;
      store.address = storeAddress || store.address;
      store.phone = phoneNumber || store.phone;
      store.email = email || store.email;
      store.status = status || store.status;
      store.tin = tin || store.tin;

      await store.save();
      return res.json({ message: 'Store updated successfully', store });
    }

    // If storeId is not provided, create a new store
    store = new StoreModel({
      name: storeName,
      firstName,
      lastName,
      address: storeAddress,
      phone: phoneNumber,
      email,
      status,
      uid,
      tin
    });

    await store.save();
    res.json({ message: 'Store created successfully', store });
  } catch (err) {
    console.error('Error creating or updating store:', err);
    res.status(500).json({ message: 'Error creating or updating store', error: err });
  }
}

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

module.exports = { getStores, createOrUpdateStore, deleteStore };
