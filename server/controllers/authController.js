const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Pandit = require('../models/Pandit');

// Helper to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_puja_connect_jwt_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      phone
    });

    // If role is pandit, create a draft Pandit profile
    if (user.role === 'pandit') {
      await Pandit.create({
        user: user._id,
        bio: 'Please write your spiritual bio here...',
        languages: ['Hindi'],
        location: 'Not Specified',
        experience: 1,
        rituals: [],
        availabilitySlots: [
          { day: 'Monday', slots: ['09:00 AM - 12:00 PM'] },
          { day: 'Tuesday', slots: ['09:00 AM - 12:00 PM'] },
          { day: 'Wednesday', slots: ['09:00 AM - 12:00 PM'] },
          { day: 'Thursday', slots: ['09:00 AM - 12:00 PM'] },
          { day: 'Friday', slots: ['09:00 AM - 12:00 PM'] },
          { day: 'Saturday', slots: ['09:00 AM - 12:00 PM'] },
          { day: 'Sunday', slots: ['09:00 AM - 12:00 PM'] }
        ],
        isVerified: 'pending'
      });
    }

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let profileData = null;

    if (user.role === 'pandit') {
      profileData = await Pandit.findOne({ user: user._id }).populate('rituals.ritual');
    }

    res.status(200).json({
      success: true,
      user,
      profile: profileData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
