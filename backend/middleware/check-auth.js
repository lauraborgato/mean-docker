const jwt = require('jsonwebtoken');
const config = require('../../utils/config');

module.exports = (req, res, next) => {

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (err) {
    res.status(401).json({ message: 'You are not authenticated' });
  }


};
