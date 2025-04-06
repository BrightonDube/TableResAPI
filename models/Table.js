const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: String,
        required: true,
        unique: true, 
        trim: true,   
        maxlength: 50 
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,      
        max: 20      
    },
    location: {
        type: String,
        trim: true,   
        maxlength: 100 
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true 
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;