const verifyToken = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    
    // For API requests (accepts JSON)
    if (req.accepts('json')) {
        return res.status(401).json({ 
            success: false,
            message: 'Authentication required to access this endpoint.' 
        });
    }
    
    // For web browser requests
    return res.redirect('/login');
};

module.exports = { verifyToken };