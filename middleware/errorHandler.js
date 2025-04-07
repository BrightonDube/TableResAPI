// middleware/errorHandler.js
const { formatResponse } = require('../utils/dataTransformUtils');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Determine status code
  const statusCode = err.statusCode || 500;
  
  // Format the error response
  const response = formatResponse(
    false,
    err.message || 'An unexpected error occurred',
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : null
  );
  
  res.status(statusCode).json(response);
};

module.exports = errorHandler;