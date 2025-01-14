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

const Order = mongoose.model('Order', gCashSchema);

module.exports = Order;
