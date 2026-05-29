const express = require('express');
const router = express.Router();
const { verifyPandit, createRitual, getStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin')); // Ensure all routes in this file require admin role

router.get('/stats', getStats);
router.put('/pandits/:id/verify', verifyPandit);
router.post('/rituals', createRitual);

module.exports = router;
