const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      // User ID in JWT doesn't exist in DB (e.g. switched from local to Atlas DB)
      // Return 401 so the frontend clears the stale token and re-logs in
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found. Please log in again.' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
    return;
  }

  res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = { protect };
