const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    agentName: {
        type: String,
        required: true
    },
    teamLeaderName: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true
    },
    guid: {
        type: String,
        required: true
    },
    storeUid: {
        type: String,
        required: true
    },
    userUid: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        required: true
    },
    storeName: {
        type: String,
        required: true
    },
    tin: {
        type: String,
        required: true
    },
    listPrice: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true,
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
        required: true
    },
    paymentImage: {
        type: String,
        required: true
    },
    remarks: {
        type: String,
        required: true
    },
    receiptUid: {
        type: String,
        required: true
    },
    products: [{
        product_uid: {
            type: String,
            required: false
        },
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
        discount: {
            type: Number,
            required: true,
            default: 0
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
