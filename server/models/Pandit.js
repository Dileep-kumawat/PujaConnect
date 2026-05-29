const mongoose = require('mongoose');

const panditSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    required: [true, 'Please add a bio']
  },
  languages: {
    type: [String],
    required: [true, 'Please add at least one spoken language']
  },
  location: {
    type: String,
    required: [true, 'Please add operational location (City)'],
    trim: true
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  },
  rituals: [
    {
      ritual: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ritual',
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  availabilitySlots: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
      },
      slots: {
        type: [String], // e.g., ["09:00 AM - 12:00 PM", "02:00 PM - 05:00 PM"]
        default: []
      }
    }
  ],
  isVerified: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  profilePic: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pandit', panditSchema);
