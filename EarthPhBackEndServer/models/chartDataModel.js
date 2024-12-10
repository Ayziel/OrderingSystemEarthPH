const mongoose = require('mongoose');

const chartDataSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    totalSales: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    totalItems: {
        type: Number,
        required: true
    },
    totalDiscount: {
        type: Number,
        required: true
    },
    totalOrders: {
        type: Number,
        required: true
    },
    itemSales: [{
        itemName: {
            type: String,
            required: true
        },
        saleDate: {
            type: String,
            required: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        Quantity: {
            type: Number,
            required: true
        },
        totalQuantity: {
            type: Number,  // Add totalQuantity field here
            required: true
        }
    }]
});

const ChartData = mongoose.model('ChartData', chartDataSchema);

module.exports = ChartData;
