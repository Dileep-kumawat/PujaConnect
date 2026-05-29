const mongoose = require('mongoose');

const ritualSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a ritual name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  duration: {
    type: String,
    required: [true, 'Please add duration (e.g. 2 hours)']
  },
  requiredMaterials: {
    type: [String],
    default: []
  },
  basePriceRange: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  locationType: {
    type: String,
    enum: ['Home', 'Temple', 'Both'],
    default: 'Both'
  },
  image: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ritual', ritualSchema);
