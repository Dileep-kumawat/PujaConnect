require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const panditRoutes = require('./routes/panditRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ritualRoutes = require('./routes/ritualRoutes');
const path = require('path');

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes Mount
app.use('/api/auth', authRoutes);
app.use('/api/pandits', panditRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rituals', ritualRoutes);

// // Root Endpoint
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Welcome to the PujaConnect API!',
//     version: '1.0.0',
//     status: 'Operational',
//     timestamp: new Date()
//   });
// });

// Catch-all wildcard route for undefined API endpoints
app.use(/^\/api\/.*$/, (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Catch-all route to serve the React app for non-API requests
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Generic Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(`\x1b[31m[Server Error]\x1b[0m ${err.stack}`);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\x1b[35m[PujaConnect Server Running]\x1b[0m Mode: Development, Port: ${PORT}`);
});
