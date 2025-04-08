const mongoose = require('mongoose');

const reservationStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
    maxlength: 50,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  
}, { timestamps: true }); 

const ReservationStatus = mongoose.model('ReservationStatus', reservationStatusSchema);

module.exports = ReservationStatus;