const Reservation = require('../models/Reservation');
const Table = require('../models/Table'); // Import Table model

// Create a new reservation
exports.createReservation = async (req, res) => {
    try {
        // Verify that the table exists.
        const table = await Table.findById(req.body.tableId);

        if (!table)
        {
            return res.status(400).json({ message: "Invalid tableId" });
        }
        const newReservation = new Reservation(req.body);
        const savedReservation = await newReservation.save();
        res.status(201).json(savedReservation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all reservations
exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a specific reservation by ID
exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        res.json(reservation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an existing reservation
exports.updateReservation = async (req, res) => {
    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(req.params.reservationId, req.body, { new: true });
        if (!updatedReservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        res.json(updatedReservation);
    } catch (err) {
        res.status(400).json({ message: err.message }); // Validation errors
    }
};

// Delete a reservation
exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        res.status(204).send(); // No content
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};