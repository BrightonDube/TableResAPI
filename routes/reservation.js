// routes/reservation.js
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { validateReservationInput } = require('../middleware/dataValidationMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');


router.post('/', verifyToken, validateReservationInput, reservationController.createReservation);


router.get('/', verifyToken, reservationController.getAllReservations);


router.get('/:reservationId', verifyToken, reservationController.getReservationById);


router.put('/:reservationId', verifyToken, validateReservationInput, reservationController.updateReservation);


router.delete('/:reservationId', verifyToken, reservationController.deleteReservation);

module.exports = router;