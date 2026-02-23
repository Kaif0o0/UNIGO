const express = require('express');
const router = express.Router();
const { createMentor, getMentors } = require('../controllers/mentorController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getMentors).post(protect, createMentor);

module.exports = router;
