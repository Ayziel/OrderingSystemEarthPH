const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true
  },
  userUid: {
    type: String,
    required: true
  },
  lionTigerCoil: {
    type: String,
    required: true
  },
  bayconCoil: {
    type: String,
    required: true
  },
  otherBrandsCoil: {
    type: String,
    required: true
  },
  arsCoil: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;
