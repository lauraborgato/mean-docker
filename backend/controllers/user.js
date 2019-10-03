
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const config = require('../../utils/config');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User Created',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
              message: 'Invalid authentication credentials'
          });
        });
    });
}

exports.login = (req, res, next) => {
  let fetchuser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      fetchuser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(404).json({
          message: 'Auth failed'
        });
      }
      const token = jwt.sign({ email: fetchuser.email, userId: fetchuser._id }, config.JWT_SECRET, { expiresIn: "1h" }); //secret_this_should_be_longer string for authentications only lives in the server
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchuser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Invalid authentication credentials'
      });
    });
}
