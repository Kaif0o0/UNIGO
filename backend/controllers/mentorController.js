const Mentor = require('../models/Mentor');

// @desc    Register as a mentor
// @route   POST /api/mentors
// @access  Private
const createMentor = async (req, res) => {
  try {
    const { name, skills, price, bio, experience } = req.body;

    // Check if user is already a mentor
    const mentorExists = await Mentor.findOne({ user: req.user._id });

    if (mentorExists) {
      res.status(400);
      throw new Error('You are already registered as a mentor');
    }

    const mentor = new Mentor({
      user: req.user._id,
      name,
      skills,
      price,
      bio,
      experience,
    });

    const createdMentor = await mentor.save();
    res.status(201).json(createdMentor);
  } catch (error) {
    console.error('CREATE MENTOR ERROR:', error);
    res.status(400).json({ message: error.message || 'Invalid mentor data' });
  }
};

// @desc    Get all active mentors
// @route   GET /api/mentors
// @access  Public
const getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ isActive: true }).populate('user', 'name email');
    res.json(mentors);
  } catch (error) {
    console.error('GET MENTORS ERROR:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createMentor,
  getMentors,
};
