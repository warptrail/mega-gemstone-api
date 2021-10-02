const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const createJwt = (subject, payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    subject,
    algorithm: 'HS256',
    expiresIn: 300,
  });
};

module.exports = createJwt;
