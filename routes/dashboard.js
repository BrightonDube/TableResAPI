const express = require('express');
const router = express.Router();
const Table = require('../models/Table'); // Adjust path as needed
const Reservation = require('../models/Reservation'); // Adjust path as needed

// Dashboard route with authentication check
router.get('/', async (req, res) => {
  if (!req.isAuthenticated()) {
    console.log('Dashboard Route - req.user:', req.user); // Log req.user
    console.log('Dashboard Route - req.session:', req.session); // Log
    return res.redirect('/login'); // Or your login route
  }

  try {
    console.log("Successfully authenticated.");
    const [tables, reservations] = await Promise.all([
      Table.find(),
      Reservation.find(),
    ]);

    res.render('dashboard', {
      title: 'Dashboard',
      user: req.user,
      tables,
      reservations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', {
      message: 'Error retrieving dashboard data',
      error: err,
    });
  }
});

module.exports = router;
