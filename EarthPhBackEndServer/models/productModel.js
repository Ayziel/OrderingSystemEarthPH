const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productSKU: {
    type: String,
    required: false,
  },
  productName: {
    type: String,
    required: false,
  },
  productDescription: {
    type: String,
    required: false,
  },
  brand: {
    type: String,
    required: false,
  },
  productCategory: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  quantity: {
    type: Number,
    required: false,
  },
  productImage: {
    type: String, // Store the Base64 string
    required: false,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
