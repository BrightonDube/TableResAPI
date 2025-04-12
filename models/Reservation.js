const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    tableId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Table model
      ref: 'Table', 
      required: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true, 
      maxlength: 100, 
    },
    customerPhone: {
      type: String,
      trim: true, 
      maxlength: 20, 
    },
    customerEmail: {
      type: String,
      trim: true, 
      maxlength: 20, 
    },
    reservationTime: {
      type: Date, 
      required: true,
    },
    partySize: {
      type: Number,
      required: true,
      min: 1,
      max: 20, 
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Seated', 'Cancelled'],
      default: 'Pending',
    },
    notes: {
      type: String,
      trim: true, 
      maxlength: 200, 
    },
  },
  {
    timestamps: true, 
  }
);

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
