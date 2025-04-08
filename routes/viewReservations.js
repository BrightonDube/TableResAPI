// routes/viewReservations.js
const express = require('express');
const router = express.Router();


router.get('/create', (req, res) => {
    res.render('reservations/create', { title: 'Create Reservation', user: req.user });
});

module.exports = router;
