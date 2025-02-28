const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
    area: {
        type: String,
        required: true,
        unique: true
    },
    areaCode: {
        type: String,
        required: true,
        unique: true
    }
});

const Area = mongoose.model('Area', areaSchema);

module.exports = Area;
