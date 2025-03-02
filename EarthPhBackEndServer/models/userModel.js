const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true 
  },
  middleName: {
    type: String,
    required: false 
  },
  lastName: {
    type: String,
    required: true 
  },
  workPhone: {
    type: String,
    required: true 
  },
  phoneNumber: {
    type: String,
    required: true 
  },
  email: {
    type: String,
    required: true,  
    unique: true    
  },
  team: {
    type: String,
    required: true  
  },
  userName: {
    type: String,
    required: true 
  },
  tin : { 
    type: Number,
    required: false  
  },
  password: {
    type: String,
    required: true  
  },
  role: {
    type: String,
    required: true 
  },
  address: {
    type: String,
    required: true  
  },
  uid: {
  type: String,
  required: true
},
area: {
  type: String,
  required: true
},
id: {
  type: String,
  required: true
},
totpSecret: {
  type: String,
  required: false 
},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
