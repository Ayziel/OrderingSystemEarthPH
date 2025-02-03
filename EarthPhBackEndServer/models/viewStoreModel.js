const mongoose = require('mongoose');

const viewStoreSchema = new mongoose.Schema({
  agentName: {
    type: String,
    required: true  // Marked as required
  },
  agentUid: {
    type: String,
    required: false  // Optional field
  },
  Location: {
    type: String,
    required: true  // Marked as required
  },
  storeName: {
    type: String,
    required: true  // Optional field
  },
  storeUid: {
    type: String,
    required: true  // Marked as required
  },
  uid: {
    type: String,
    required: true,  // Marked as required
    unique: true     // Ensures email is unique in the collection
  },
  createdAt: {
    type: String,
    required: true  // Marked as required
  },
  image: {
    type: String, // Stores the base64 string of the image
    required: false // Optional field, you can make this required if necessary
  }
});

const ViewStore = mongoose.model('ViewStore', viewStoreSchema);

module.exports = ViewStore;
