const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const createJwt = (subject, payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    subject,
    algorithm: 'HS256',
    expiresIn: JWT_EXPIRY,
  });
};

module.exports = createJwt;
