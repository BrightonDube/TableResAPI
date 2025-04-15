// controllers/authController.js
const passport = require('../config/passport');

exports.googleAuth = (req, res, next) => {
  const frontendBaseUrl =
    process.env.FRONTEND_URL || 'http://127.0.0.1:5500/table_whisperer'; 
  req.session.returnTo = req.headers.referer || `${frontendBaseUrl}/dashboard.html`;
  passport.authenticate('google', { scope: ['profile', 'email'] })(
    req,
    res,
    next
  );
};

exports.googleCallback = (req, res, next) => {
    const frontendBaseUrl =
    process.env.FRONTEND_URL || 'http://127.0.0.1:5500/table_whisperer';  
  passport.authenticate('google', {
    failureRedirect: `${frontendBaseUrl}/#`,
  })(req, res, (err) => {
    if (err) {
      console.error('Google authentication error:', err); // Log the error for debugging
      return res.redirect(`${frontendBaseUrl}/#`); // Redirect to login on error
    }

    const redirectUrl = req.session.returnTo || 'http://127.0.0.1:5500/table_whisperer';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  });
};

exports.logout = (req, res, next) => {
    const frontendBaseUrl =
    process.env.FRONTEND_URL || 'http://127.0.0.1:5500/table_whisperer';  
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    const redirectUrl = req.query.redirect || `${frontendBaseUrl}/#`; // Default to homepage if no redirect is provided
    res.redirect(redirectUrl);
  });
};
