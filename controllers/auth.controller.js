const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user.model');

const {
  CREATED_CODE,
  INCORRECT_ERROR_MESSAGE,
  AUTH_ERROR_MESSAGE,
  UNAUTHORIZED_CODE,
  CONFLICT_CODE,
  INCORRECT_CODE,
} = require('../utils/constants');

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  return User.findOne({ email })
    .then((user) => {
      if (user !== null) {
        res.status(CONFLICT_CODE).send({ message: 'Пользователь с таким Email уже зарегистрирован' });
      }
    })
    .then(() => {
      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({ name, about, avatar, email, password: hash });
        });
    })
    .then((user) => {
      res.status(CREATED_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(INCORRECT_CODE).send({ message: `${INCORRECT_ERROR_MESSAGE} при создании пользователя` });
      }
      if (err.code === 11000) {
        next();
      }
      next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (user === null || !bcrypt.compare(password, user.password)) {
        res.status(UNAUTHORIZED_CODE).send({ message: `${AUTH_ERROR_MESSAGE}` });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN, { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};
