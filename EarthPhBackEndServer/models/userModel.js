const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true  // Marked as required
  },
  middleName: {
    type: String,
    required: false  // Optional field
  },
  lastName: {
    type: String,
    required: true  // Marked as required
  },
  workPhone: {
    type: String,
    required: true  // Optional field
  },
  phoneNumber: {
    type: String,
    required: true  // Marked as required
  },
  email: {
    type: String,
    required: true,  // Marked as required
    unique: true     // Ensures email is unique in the collection
  },
  team: {
    type: String,
    required: true  // Marked as required
  },
  userName: {
    type: String,
    required: true  // Marked as required
  },
  tin : { 
    type: Number,
    required: false  // Marked as required
  },
  password: {
    type: String,
    required: true  // Marked as required
  },
  role: {
    type: String,
    required: true  // Marked as required
  },
  address: {
    type: String,
    required: true  // Optional field
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
