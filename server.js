require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const session = require('express-session');
const passport = require('./config/passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const errorHandler = require('./middleware/errorHandler');

// Models
const Table = require('./models/Table');
const Reservation = require('./models/Reservation');

// Routes
const tableRoutes = require('./routes/table');
const reservationRoutes = require('./routes/reservation');
const authRoutes = require('./routes/auth');
const viewTablesRoutes = require('./routes/viewTables');
const viewReservationsRoutes = require('./routes/viewReservations');
const expressLayouts = require('express-ejs-layouts');

const {
  verifyToken,
  // optional: requireLogin
} = require('./middleware/authMiddleware');
const {
  validateTableInput,
  validateReservationInput,
} = require('./middleware/dataValidationMiddleware');

const app = express();
const port = process.env.PORT || 3000;

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(expressLayouts);

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.set('layout', 'layouts/main');

// Global User
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// API Routes
app.use('/api/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/auth', authRoutes);

// View Routes
app.use('/tables', viewTablesRoutes);
app.use('/reservations', viewReservationsRoutes);

// Home
app.get('/', (req, res) => {
  res.render('index', { title: 'Home', user: req.user });
});

// Login
app.get('/login', (req, res) => {
  res.render('login', { title: 'Login', user: null });
});

// Dashboard
app.get('/dashboard', async (req, res) => {
  try {
    const [tables, reservations] = await Promise.all([
      Table.find(),
      Reservation.find(),
    ]);
    res.render('dashboard', {
      title: 'Dashboard',
      user: req.user,
      tables,
      reservations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving data');
  }
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error Handler
app.use(errorHandler);

// Start
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
