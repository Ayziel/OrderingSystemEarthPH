const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // Store name is required
  },
  address: {
    type: String,
    required: true // Address is required
  },
  phone: {
    type: String,
    required: true // Optional phone field
  },
  email: {
    type: String,
    required: true // Optional email field
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product' // Reference to products
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now // Automatically set creation date
  }
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
