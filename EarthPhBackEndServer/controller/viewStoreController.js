const ViewStore = require('../models/viewStoreModel');

// Create a new store
const createStore = async (req, res) => {
  try {
    const { agentName, agentUid, Location, storeName, storeUid, uid, createdAt, image } = req.body;

    // Validation for required fields
    if (!agentName || !Location || !storeName || !storeUid || !uid || !createdAt) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    // Check if a store with the same UID already exists
    const existingStore = await ViewStore.findOne({ uid });
    if (existingStore) {
      return res.status(400).json({ message: 'A store with this UID already exists.' });
    }

    const newStore = new ViewStore({ 
      agentName, 
      agentUid, 
      Location, 
      storeName, 
      storeUid, 
      uid, 
      createdAt,
      image  // Include the image in the new store
    });

    const savedStore = await newStore.save();

    res.status(201).json({ message: 'Store created successfully!', store: savedStore });
  } catch (err) {
    console.error('Error creating store:', err);
    res.status(500).json({ message: 'Error creating store.', error: err.message });
  }
};


// Get all stores or a specific store by UID
const getStores = async (req, res) => {
  try {
    const { uid } = req.query; // Optional query parameter

    if (uid) {
      const store = await ViewStore.findOne({ uid });
      if (!store) {
        return res.status(404).json({ message: 'Store not found.' });
      }
      return res.json({ store });  // Includes the image field in the response
    }

    const stores = await ViewStore.find();
    res.json({ stores });  // Includes the image field for all stores
  } catch (err) {
    console.error('Error fetching stores:', err);
    res.status(500).json({ message: 'Error fetching stores.', error: err.message });
  }
};


// Update a store by UID
const updateStore = async (req, res) => {
  try {
    const { uid, image, ...updateData } = req.body;

    if (!uid) {
      return res.status(400).json({ message: 'UID is required to update a store.' });
    }

    // If an image is provided, include it in the update data
    if (image) {
      updateData.image = image;
    }

    const updatedStore = await ViewStore.findOneAndUpdate({ uid }, updateData, { new: true });

    if (!updatedStore) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    res.json({ message: 'Store updated successfully!', store: updatedStore });
  } catch (err) {
    console.error('Error updating store:', err);
    res.status(500).json({ message: 'Error updating store.', error: err.message });
  }
};


// Delete a store by UID
const deleteStore = async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ message: 'UID is required to delete a store.' });
    }

    const deletedStore = await ViewStore.findOneAndDelete({ uid });

    if (!deletedStore) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    res.json({ message: 'Store deleted successfully!', store: deletedStore });
  } catch (err) {
    console.error('Error deleting store:', err);
    res.status(500).json({ message: 'Error deleting store.', error: err.message });
  }
};

module.exports = { createStore, getStores, updateStore, deleteStore };
