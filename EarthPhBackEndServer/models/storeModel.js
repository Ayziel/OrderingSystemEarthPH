const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // Store name is required
  },
  firstName: {
    type: String,
    required: true // First name of the contact person is required
  },
  lastName: {
    type: String,
    required: true // Last name of the contact person is required
  },
  address: {
    type: String,
    required: true // Address is required
  },
  phone: {
    type: Number,
    required: true // Optional phone field
  },
  email: {
    type: String,
    required: true // Optional email field
  },
  status: {
    type: String,
    required: true // Optional status field
  },
  createdAt: {
    type: Date,
    default: Date.now // Automatically set creation date
  }
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
