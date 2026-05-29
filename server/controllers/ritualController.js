const Ritual = require('../models/Ritual');

// @desc    Get all rituals
// @route   GET /api/rituals
// @access  Public
exports.getAllRituals = async (req, res) => {
  try {
    const rituals = await Ritual.find({}).sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: rituals.length,
      data: rituals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single ritual
// @route   GET /api/rituals/:id
// @access  Public
exports.getRitualById = async (req, res) => {
  try {
    const ritual = await Ritual.findById(req.params.id);
    if (!ritual) {
      return res.status(404).json({ success: false, message: 'Ritual category not found' });
    }
    res.status(200).json({
      success: true,
      data: ritual
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
