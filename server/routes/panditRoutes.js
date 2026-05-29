const express = require('express');
const router = express.Router();
const { getAllPandits, getPanditById, updatePanditProfile } = require('../controllers/panditController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllPandits);
router.get('/:id', getPanditById);
router.put('/profile', protect, authorize('pandit'), updatePanditProfile);

module.exports = router;
