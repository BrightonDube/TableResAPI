// routes/viewTables.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

// Apply verifyToken middleware to protect the route
router.get('/create', verifyToken, (req, res) => {
    try {
        res.render('tables/create', { 
            title: 'Create Table', 
            user: req.user,
            csrfToken: req.csrfToken() // If using CSRF protection
        });
    } catch (err) {
        console.error('Error rendering create table view:', err);
        res.status(500).render('error', {
            message: 'Error loading table creation form',
            error: process.env.NODE_ENV === 'development' ? err : {}
        });
    }
});

module.exports = router;