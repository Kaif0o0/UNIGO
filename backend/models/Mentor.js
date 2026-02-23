const mongoose = require('mongoose');

const mentorSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    bio: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      default: 'Experienced Student',
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;
