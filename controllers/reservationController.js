// controllers/reservationController.js
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
// Import the utility functions
const { 
  formatReservation,
  toObjectId, 
  buildQueryFilters, 
  getPaginationOptions,
  formatResponse 
} = require('../utils/dataTransformUtils');

// Create a new reservation
exports.createReservation = async (req, res) => {
    try {
        // Verify that the table exists using the toObjectId utility
        const tableId = toObjectId(req.body.tableId);
        if (!tableId) {
            return res.status(400).json(
                formatResponse(false, "Invalid table ID format")
            );
        }
        
        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(400).json(
                formatResponse(false, "Invalid tableId, table not found")
            );
        }
        
        // Format the reservation data before saving
        const formattedData = formatReservation(req.body);
        const newReservation = new Reservation(formattedData);
        const savedReservation = await newReservation.save();
        
        res.status(201).json(
            formatResponse(true, "Reservation created successfully", savedReservation)
        );
    } catch (err) {
        res.status(500).json(
            formatResponse(false, err.message)
        );
    }
};

// Get all reservations
exports.getAllReservations = async (req, res) => {
    try {
        // Use pagination and filtering utilities
        const filters = buildQueryFilters(req.query);
        const { page, limit, skip, sort } = getPaginationOptions(req.query);
        
        const reservations = await Reservation.find(filters)
            .sort(sort)
            .skip(skip)
            .limit(limit);
            
        const total = await Reservation.countDocuments(filters);
        
        const meta = {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        };
        
        res.json(
            formatResponse(true, "Reservations retrieved successfully", reservations, meta)
        );
    } catch (err) {
        res.status(500).json(
            formatResponse(false, err.message)
        );
    }
};

// Get a specific reservation by ID
exports.getReservationById = async (req, res) => {
    try {
        const reservationId = toObjectId(req.params.reservationId);
        if (!reservationId) {
            return res.status(400).json(
                formatResponse(false, "Invalid reservation ID format")
            );
        }
        
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json(
                formatResponse(false, "Reservation not found")
            );
        }
        
        res.json(
            formatResponse(true, "Reservation retrieved successfully", reservation)
        );
    } catch (err) {
        res.status(500).json(
            formatResponse(false, err.message)
        );
    }
};

// Update an existing reservation
exports.updateReservation = async (req, res) => {
    try {
        const reservationId = toObjectId(req.params.reservationId);
        if (!reservationId) {
            return res.status(400).json(
                formatResponse(false, "Invalid reservation ID format")
            );
        }
        
        // Format the reservation data before updating
        const formattedData = formatReservation(req.body);
        
        const updatedReservation = await Reservation.findByIdAndUpdate(
            reservationId, 
            formattedData, 
            { new: true }
        );
        
        if (!updatedReservation) {
            return res.status(404).json(
                formatResponse(false, "Reservation not found")
            );
        }
        
        res.json(
            formatResponse(true, "Reservation updated successfully", updatedReservation)
        );
    } catch (err) {
        res.status(400).json(
            formatResponse(false, err.message)
        );
    }
};
// Delete a reservation
exports.deleteReservation = async (req, res) => {
    try {
        const reservationId = toObjectId(req.params.reservationId);
        if (!reservationId) {
            return res.status(400).json(
                formatResponse(false, "Invalid reservation ID format")
            );
        }

        const deletedReservation = await Reservation.findByIdAndDelete(reservationId);

        if (!deletedReservation) {
            return res.status(404).json(
                formatResponse(false, "Reservation not found")
            );
        }

        res.json(
            formatResponse(true, "Reservation deleted successfully", deletedReservation)
        );
    } catch (err) {
        res.status(500).json(
            formatResponse(false, err.message)
        );
    }
};
