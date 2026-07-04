const jwt = require('jsonwebtoken');
const config = require('../config');

// Generate an access token
const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

// Generate a refresh token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });
};

// Verify an access token
const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

// Verify a refresh token
const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwtRefreshSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
