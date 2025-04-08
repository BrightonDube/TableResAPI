// controllers/authController.js
// controllers/authController.js
const passport = require('../config/passport');

exports.googleAuth = (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

exports.googleCallback = (req, res) => {
    passport.authenticate('google', {
        failureRedirect: '/login',
        successRedirect: '/',
    })(req, res, () => {
        res.redirect('/');
    });
};

exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
};