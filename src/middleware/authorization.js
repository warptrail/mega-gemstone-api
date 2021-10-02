// this middleware authorizes the person logged in
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const authorize = async (req, res, next) => {
  try {
    //^ step #1: fetch the token from the request header

    const jwToken = req.header('token');

    // check token exists
    if (!jwToken) {
      return res
        .status(403)
        .json({ message: 'You Shall Not Be Authorized!!!' });
    }

    // check token is valid
    // if the token is verified, then it returns a payload
    // that we can use in our routes
    const payload = jwt.verify(jwToken, JWT_SECRET);

    req.user = payload.user_uid;
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(403).json({ message: 'You Shall Not Be Authorized!!!' });
  }
};

module.exports = authorize;
