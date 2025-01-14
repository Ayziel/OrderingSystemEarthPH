const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  storeUid: {
    type: String,
    required: true,
  },
  storeName: {
    type: String,
    required: true,
  },
  productSKU: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number, // Store the discount as a percentage (e.g., 10 for 10%)
    default: 0,   // Default is no discount
  },
  size: {
    type: String,
    required: false,
  },
  productImage: {
    type: String, // Store the Base64 string
    required: true,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
