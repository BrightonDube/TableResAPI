// controllers/authController.js
const passport = require('../config/passport');

exports.googleAuth = (req, res, next) => {
  const frontendBaseUrl =
    process.env.FRONTEND_BASE_URL || 'http://localhost:3000'; // Use environment variable for flexibility
  req.session.returnTo = req.headers.referer || `${frontendBaseUrl}/dashboard`;
  passport.authenticate('google', { scope: ['profile', 'email'] })(
    req,
    res,
    next
  );
};

exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', {
    failureRedirect: '/login',
  })(req, res, (err) => {
    if (err) {
      console.error('Google authentication error:', err); // Log the error for debugging
      return res.redirect('/login'); // Redirect to login on error
    }

    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  });
};

exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    const redirectUrl = req.query.redirect || '/'; // Default to homepage if no redirect is provided
    res.redirect(redirectUrl);
  });
};
