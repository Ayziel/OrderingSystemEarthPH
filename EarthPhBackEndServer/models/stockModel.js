const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    uid: 
    { 
        type: String, 
        required: true 
    },
    parent_uid: 
    { 
        type: String, 
        required: true 
    },
    product_uid: {
        type: String,
        required: true
    },
    store_name: 
    { 
        type: String, 
        required: true 
    },
    product_name: 
    { 
        type: String, 
        required: true 
    },
    quantity: 
    { 
        type: Number, 
        required: true 
},
});

const StockModel = mongoose.model('Stock', stockSchema);

module.exports = StockModel;
