const mongoose = require('mongoose');

const gCashSchema = new mongoose.Schema({
    cash: {
        type: String,
        required: true,
    },
    userUid: {
        type: String,
        required: true
    },
});

const Gcash = mongoose.model('gcash', gCashSchema);

module.exports = Gcash;
