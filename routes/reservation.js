// routes/reservation.js
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const {
  validateReservationInput,
} = require('../middleware/dataValidationMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

router.post(
  '/',
  verifyToken,
  validateReservationInput,
  reservationController.createReservation
);

router.get('/', reservationController.getAllReservations);

router.get(
  '/:reservationId',
  reservationController.getReservationById
);

router.put(
  '/:reservationId',
  verifyToken,
  validateReservationInput,
  reservationController.updateReservation
);

router.delete(
  '/:reservationId',
  verifyToken,
  reservationController.deleteReservation
);

module.exports = router;
