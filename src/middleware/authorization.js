// this middleware authorizes the person logged in
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const authorize = async (req, res, next) => {
  try {
    //^ step #1: fetch the token from the request header

    const jwToken = req.header('token');

    // check token exists
    if (!jwToken) {
      return res.status(403).json({ error: true, message: 'No Token Exists' });
    }

    // check token is valid
    // if the token is verified, then it returns a payload
    // that we can use in our routes
    const payload = jwt.verify(jwToken, JWT_SECRET);

    const user = { username: payload.username, user_uid: payload.user_uid };

    req.user = user;
    console.log('token authorized', req.user);
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ isVerified: false, error: true, message: 'Invalid Token' });
  }
};

module.exports = authorize;
