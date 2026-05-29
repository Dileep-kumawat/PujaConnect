const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pandit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pandit',
    required: true
  },
  ritual: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ritual',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please add a booking date']
  },
  timeSlot: {
    type: String,
    required: [true, 'Please add a time slot']
  },
  address: {
    street: { type: String, required: [true, 'Please add street address'] },
    city: { type: String, required: [true, 'Please add city'] },
    postalCode: { type: String, required: [true, 'Please add postal code'] }
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
