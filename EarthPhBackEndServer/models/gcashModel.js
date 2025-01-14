const mongoose = require('mongoose');

const gCashSchema = new mongoose.Schema({
    cash: {
        type: Number,  // Changed from String to Number
        required: true,
        default: 0,    // Default value set to 0
    },
    userUid: {
        type: String,
        required: true,
    },
});

const Gcash = mongoose.model('gcash', gCashSchema);

module.exports = Gcash;
