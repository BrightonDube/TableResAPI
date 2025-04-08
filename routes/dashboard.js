const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware'); // Import the middleware
const Table = require('../models/Table');
const Reservation = require('../models/Reservation');

// Apply verifyToken middleware to the entire dashboard route
router.get('/', verifyToken, async (req, res) => {
  try {
    console.log('Successfully authenticated. User:', req.user);
    
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
    console.error('Dashboard error:', err);
    res.status(500).render('error', {
      message: 'Error retrieving dashboard data',
      error: err,
    });
  }
});

module.exports = router;