const logger = require('../logger');
const timestamp = require('../helpers/timestamp');

module.exports = function (req, res, next) {
  const { username, password } = req.body;

  if (req.path === '/register') {
    if (![username, password].every(Boolean)) {
      logger.error(`${timestamp()} >> Missing Credentials`);
      return res.status(400).json('Missing Credentials');
    }
  } else if (req.path === '/login') {
    if (![username, password].every(Boolean)) {
      logger.error(`${timestamp()} >> Missing Credentials`);
      return res.status(400).json('Missing Credentials');
    }
  }

  next();
};
