const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    agentName: {
        type: String,
        required: true
    },
    teamLeaderName: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: false
    },
    orderDate: {
        type: Date,
        required: true
    },
    storeName: {
        type: String,
        required: false
    },
    houseAddress: {
        type: String,
        required: false
    },
    townProvince: {
        type: String,
        required: false
    },
    storeCode: {
        type: String,
        required: false
    },
    tin: {
        type: String,
        required: false
    },
    listPrice: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: false,
        default: 0
    },
    totalItems: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMode: {
        type: String,
        required: false
    },
    paymentImage: {
        type: String,
        required: false
    },
    remarks: {
        type: String,
        required: false
    },
    products: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    }]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
