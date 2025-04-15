// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/google', authController.googleAuth);

router.get('/google/callback', authController.googleCallback);

router.get('/logout', authController.logout);

// Add this new route for checking authentication status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: {
        email: req.user.email,
        // Add other user properties you want to expose
      },
    });
  } else {
    res.json({
      isAuthenticated: false,
      user: null,
    });
  }
});

module.exports = router;
