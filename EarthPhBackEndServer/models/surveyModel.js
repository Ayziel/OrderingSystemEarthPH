const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  userUid: {
    type: String,
    required: true
  },
  insectControl: {
    type: String,
    required: true
  },
  rodentControl: {
    type: String,
    required: true
  },
  fabricSpray: {
    type: String,
    required: true
  },
  airConCleaner: {
    type: String,
    required: true
  },
  petCare: {
    type: String,
    required: true
  },
  selectedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Reference to products
      required: true
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;
