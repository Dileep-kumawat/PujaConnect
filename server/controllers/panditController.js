const Pandit = require('../models/Pandit');
const Ritual = require('../models/Ritual');

// @desc    Get all verified Pandits with filters
// @route   GET /api/pandits
// @access  Public
exports.getAllPandits = async (req, res) => {
  try {
    const { location, ritual, language, minExperience, search } = req.query;
    
    // Build query object
    let query = { isVerified: 'verified' };

    // Apply location filter (case-insensitive)
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Apply language filter (case-insensitive match in array)
    if (language) {
      query.languages = { $regex: language, $options: 'i' };
    }

    // Apply minimum experience filter
    if (minExperience) {
      query.experience = { $gte: Number(minExperience) };
    }

    let pandits = await Pandit.find(query)
      .populate('user', 'name email phone')
      .populate('rituals.ritual');

    // Post-filtering for rituals since rituals is an array of objects
    if (ritual) {
      pandits = pandits.filter(p => 
        p.rituals.some(r => r.ritual && r.ritual._id.toString() === ritual)
      );
    }

    // Post-filtering for search text matching name or bio
    if (search) {
      const searchLower = search.toLowerCase();
      pandits = pandits.filter(p => 
        (p.user && p.user.name.toLowerCase().includes(searchLower)) ||
        p.bio.toLowerCase().includes(searchLower)
      );
    }

    res.status(200).json({
      success: true,
      count: pandits.length,
      data: pandits
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single Pandit profile
// @route   GET /api/pandits/:id
// @access  Public
exports.getPanditById = async (req, res) => {
  try {
    const pandit = await Pandit.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('rituals.ritual');

    if (!pandit) {
      return res.status(404).json({ success: false, message: 'Pandit profile not found' });
    }

    res.status(200).json({
      success: true,
      data: pandit
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update own Pandit profile details
// @route   PUT /api/pandits/profile
// @access  Private (Pandit only)
exports.updatePanditProfile = async (req, res) => {
  try {
    const { bio, languages, location, experience, rituals, availabilitySlots, profilePic } = req.body;

    // Find the Pandit profile linked to current user
    let pandit = await Pandit.findOne({ user: req.user.id });

    if (!pandit) {
      return res.status(404).json({ success: false, message: 'Pandit profile not found for this user' });
    }

    // Update fields
    if (bio !== undefined) pandit.bio = bio;
    if (languages !== undefined) pandit.languages = languages;
    if (location !== undefined) pandit.location = location;
    if (experience !== undefined) pandit.experience = Number(experience);
    if (rituals !== undefined) pandit.rituals = rituals;
    if (availabilitySlots !== undefined) pandit.availabilitySlots = availabilitySlots;
    if (profilePic !== undefined) pandit.profilePic = profilePic;

    // Save profile (triggering Mongoose validation)
    await pandit.save();

    // Populate updated profile details for response
    pandit = await Pandit.findById(pandit._id)
      .populate('user', 'name email phone')
      .populate('rituals.ritual');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: pandit
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
