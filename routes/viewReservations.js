const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/create', verifyToken, (req, res) => {
    try {
        res.render('reservations/create', { 
            title: 'Create Reservation',
            user: req.user
        });
    } catch (error) {
        res.status(500).render('error');
    }
});

module.exports = router;