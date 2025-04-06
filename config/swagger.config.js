const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant Reservation API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Restaurant Reservation system',
    },
  },
  apis: [path.join(__dirname, '../routes/*.js')], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;