const jwt = require('jsonwebtoken');

const generateToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
};

module.exports = {
  generateToken,
  verifyToken
};
