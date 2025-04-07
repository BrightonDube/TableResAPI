// middleware/authMiddleware.js
const verifyToken = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); 
    } else {
        return res.status(401).json({ message: 'Authentication required to access this endpoint.' }); // 401 Unauthorized
    }
};

module.exports = { verifyToken };