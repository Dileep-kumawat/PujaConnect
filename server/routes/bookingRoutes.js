const express = require('express');
const router = express.Router();
const { createBooking, getBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.use(protect); // All booking routes are protected

router.route('/')
  .post(createBooking)
  .get(getBookings);

router.put('/:id/status', updateBookingStatus);

module.exports = router;
