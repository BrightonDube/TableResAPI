require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const tableRoutes = require('./routes/table');
const passport = require('./config/passport'); 
const session = require('express-session'); 

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.config');

const app = express();
const port = process.env.PORT || 3000;



// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware (before Passport)
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production' 
    }
}));

// Initialize Passport and session middleware
app.use(passport.initialize());
app.use(passport.session());

// Mount routes
app.use('/tables', tableRoutes); // Mount table routes

// Test Route
app.get('/', (req, res) => {
  res.send('Restaurant Reservation API is running!');
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
