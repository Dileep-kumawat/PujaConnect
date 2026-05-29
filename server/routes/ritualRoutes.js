const express = require('express');
const router = express.Router();
const { getAllRituals, getRitualById } = require('../controllers/ritualController');

router.get('/', getAllRituals);
router.get('/:id', getRitualById);

module.exports = router;
