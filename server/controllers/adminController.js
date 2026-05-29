const User = require('../models/User');
const Pandit = require('../models/Pandit');
const Booking = require('../models/Booking');
const Ritual = require('../models/Ritual');

// @desc    Verify and approve/reject Pandit profile
// @route   PUT /api/admin/pandits/:id/verify
// @access  Private (Admin only)
exports.verifyPandit = async (req, res) => {
  try {
    const { status } = req.body; // 'verified' or 'rejected' or 'pending'
    
    if (!['verified', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status' });
    }

    const pandit = await Pandit.findById(req.params.id).populate('user', 'name email');

    if (!pandit) {
      return res.status(404).json({ success: false, message: 'Pandit profile not found' });
    }

    pandit.isVerified = status;
    await pandit.save();

    res.status(200).json({
      success: true,
      message: `Pandit '${pandit.user.name}' has been ${status} successfully!`,
      data: pandit
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create standard Ritual
// @route   POST /api/admin/rituals
// @access  Private (Admin only)
exports.createRitual = async (req, res) => {
  try {
    const { name, description, duration, requiredMaterials, basePriceRange, locationType, image } = req.body;

    if (!name || !description || !duration || !basePriceRange) {
      return res.status(400).json({ success: false, message: 'Please provide all ritual details' });
    }

    // Check if ritual already exists
    const ritualExists = await Ritual.findOne({ name });
    if (ritualExists) {
      return res.status(400).json({ success: false, message: 'Ritual with this name already exists' });
    }

    const ritual = await Ritual.create({
      name,
      description,
      duration,
      requiredMaterials: requiredMaterials || [],
      basePriceRange,
      locationType: locationType || 'Both',
      image: image || ''
    });

    res.status(201).json({
      success: true,
      message: 'New Ritual category added successfully!',
      data: ritual
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard metrics & stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalPandits = await User.countDocuments({ role: 'pandit' });
    const totalRituals = await Ritual.countDocuments({});

    const totalBookings = await Booking.countDocuments({});
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const acceptedBookings = await Booking.countDocuments({ status: 'accepted' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    // Pandit profile breakdown
    const verifiedPanditsCount = await Pandit.countDocuments({ isVerified: 'verified' });
    const pendingPanditsCount = await Pandit.countDocuments({ isVerified: 'pending' });
    const rejectedPanditsCount = await Pandit.countDocuments({ isVerified: 'rejected' });

    // Fetch all pending pandits list for verification panel
    const pendingPandits = await Pandit.find({ isVerified: 'pending' })
      .populate('user', 'name email phone');

    // Calculate booking completion rate
    const completionRate = totalBookings > 0 
      ? Math.round((completedBookings / totalBookings) * 100) 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: totalUsers,
          pandits: totalPandits,
          rituals: totalRituals,
          bookings: totalBookings
        },
        bookingsBreakdown: {
          pending: pendingBookings,
          accepted: acceptedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings
        },
        panditsBreakdown: {
          verified: verifiedPanditsCount,
          pending: pendingPanditsCount,
          rejected: rejectedPanditsCount
        },
        completionRate,
        pendingPanditsList: pendingPandits
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
