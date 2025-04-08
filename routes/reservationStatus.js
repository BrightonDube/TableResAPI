const express = require('express');
const router = express.Router();
const reservationStatusController = require('../controllers/reservationStatusController');
const { verifyToken } = require('../middleware/authMiddleware');
const {
  validateReservationStatusInput,
} = require('../middleware/dataValidationMiddleware');

router.get(
  '/reservation-statuses',
  reservationStatusController.getAllReservationStatuses
);

router.post(
  '/reservation-statuses',
  verifyToken,
  validateReservationStatusInput,
  reservationStatusController.createReservationStatus
);

router.get(
  '/reservation-statuses/:statusId',
  reservationStatusController.getReservationStatusById
);

router.put(
  '/reservation-statuses/:statusId',
  verifyToken,
  validateReservationStatusInput,
  reservationStatusController.updateReservationStatus
);

router.delete(
  '/reservation-statuses/:statusId',
  verifyToken,
  reservationStatusController.deleteReservationStatus
);

module.exports = router;
