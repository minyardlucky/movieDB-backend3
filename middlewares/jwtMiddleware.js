const jwt = require('jsonwebtoken');
require('dotenv').config();
const errorMessages = require('../utils/errorMessages');  // This is optional, but you can use it for custom error messages

// JWT middleware to verify the token
const jwtMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Expecting the format "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }

    req.user = user;  // Attach user data to the request object (for future use)
    next();  // Proceed to the next middleware or route handler
  });
};

module.exports = jwtMiddleware;  // Proper export