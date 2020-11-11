const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  //Get the token from header
  const token = req.header('x-auth-token');

  //Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  //Verify token
  try {
    // Token is valid then decoded it and take the data from that token
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
