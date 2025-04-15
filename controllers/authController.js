// controllers/authController.js
const passport = require('../config/passport');

exports.googleAuth = (req, res, next) => {
  // Store the original URL in the session
  req.session.returnTo = req.headers.referer || '/';
  passport.authenticate('google', { scope: ['profile', 'email'] })(
    req,
    res,
    next
  );
};

exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', {
    failureRedirect: '/login',
  })(req, res, () => {
    // Retrieve the original URL from the session
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo; // Clean up the session
    res.redirect(redirectUrl);
  });
};

exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
