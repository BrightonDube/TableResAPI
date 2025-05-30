require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const session = require('express-session');
const passport = require('./config/passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const errorHandler = require('./middleware/errorHandler');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Models
const Table = require('./models/Table');
const Reservation = require('./models/Reservation');

// Routes
const tableRoutes = require('./routes/table');
const reservationRoutes = require('./routes/reservation');
const authRoutes = require('./routes/auth');
const viewTablesRoutes = require('./routes/viewTables');
const viewReservationsRoutes = require('./routes/viewReservations');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboard');
const restaurantInfoRoutes = require('./routes/restaurantInfo');
const reservationStatusRoutes = require('./routes/reservationStatus');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = process.env.PORT || 3000;

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:5500',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      httpOnly: true,
      //secure: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(expressLayouts);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Enable if needed
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Apply to all routes
app.use('/api/', limiter);

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
app.use('/api', restaurantInfoRoutes);
app.use('/api', reservationStatusRoutes);
app.use('/api/users', userRoutes);

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
app.use('/dashboard', dashboardRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error Handler
app.use(errorHandler);

// Server startup (won't execute during tests)
module.exports = app;

// Only start server when not in test mode
if (require.main === module) {
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Enhanced cleanup
  const shutdown = async () => {
    console.log('Shutting down gracefully...');
    await new Promise((resolve) => {
      server.close(resolve);
    });
    await mongoose.connection.close();
    console.log('Server and database connections closed');
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
