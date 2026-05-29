const Booking = require('../models/Booking');
const Pandit = require('../models/Pandit');
const Ritual = require('../models/Ritual');

// @desc    Create new booking request
// @route   POST /api/bookings
// @access  Private (Customer only)
exports.createBooking = async (req, res) => {
  try {
    const { panditId, ritualId, date, timeSlot, address, notes } = req.body;

    // Validate inputs
    if (!panditId || !ritualId || !date || !timeSlot || !address) {
      return res.status(400).json({ success: false, message: 'Please provide all booking details' });
    }

    // Verify Pandit exists and is verified
    const pandit = await Pandit.findById(panditId);
    if (!pandit) {
      return res.status(404).json({ success: false, message: 'Pandit profile not found' });
    }
    if (pandit.isVerified !== 'verified') {
      return res.status(400).json({ success: false, message: 'This Pandit is not verified and cannot accept bookings' });
    }

    // Find the customized price for the selected ritual from the Pandit's profile
    const ritualConfig = pandit.rituals.find(
      (r) => r.ritual.toString() === ritualId
    );

    if (!ritualConfig) {
      return res.status(400).json({
        success: false,
        message: 'This Pandit does not perform the selected ritual'
      });
    }

    const price = ritualConfig.price;

    // Create the booking
    const booking = await Booking.create({
      customer: req.user.id,
      pandit: panditId,
      ritual: ritualId,
      date,
      timeSlot,
      address,
      price,
      notes,
      status: 'pending' // default
    });

    res.status(201).json({
      success: true,
      message: 'Booking request sent successfully!',
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user-specific bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    } else if (req.user.role === 'pandit') {
      // Find pandit ID linked to this user
      const pandit = await Pandit.findOne({ user: req.user.id });
      if (!pandit) {
        return res.status(404).json({ success: false, message: 'Pandit profile not found' });
      }
      query.pandit = pandit._id;
    } else if (req.user.role === 'admin') {
      // Admins see all bookings
      query = {};
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone')
      .populate({
        path: 'pandit',
        populate: {
          path: 'user',
          select: 'name email phone'
        }
      })
      .populate('ritual')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (accept, reject, cancel, complete)
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status values
    const allowedStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status update value' });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Role-based authorization rules
    if (req.user.role === 'customer') {
      // Customers can only cancel their own pending or accepted bookings
      if (booking.customer.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this booking' });
      }
      if (status !== 'cancelled') {
        return res.status(400).json({ success: false, message: 'Customers can only cancel bookings' });
      }
    } else if (req.user.role === 'pandit') {
      // Pandits can only update bookings assigned to them
      const pandit = await Pandit.findOne({ user: req.user.id });
      if (!pandit || booking.pandit.toString() !== pandit._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this booking' });
      }

      // Pandits can accept, reject or mark completed
      if (!['accepted', 'rejected', 'completed'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Pandits can only accept, reject, or complete bookings' });
      }
    } else if (req.user.role === 'admin') {
      // Admins can do any status transition
    }

    // Apply the status change
    booking.status = status;
    await booking.save();

    // Populate for clean response
    const updatedBooking = await Booking.findById(booking._id)
      .populate('customer', 'name email phone')
      .populate({
        path: 'pandit',
        populate: {
          path: 'user',
          select: 'name email phone'
        }
      })
      .populate('ritual');

    res.status(200).json({
      success: true,
      message: `Booking status updated to '${status}' successfully!`,
      data: updatedBooking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
