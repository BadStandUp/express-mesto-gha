const mongoose = require('mongoose');
const User = require('../models/user.model');

const {
  NOT_FOUND_USER_MESSAGE,
  INCORRECT_ERROR_MESSAGE,
} = require('../utils/constants');
const {
  IncorrectError,
  NotFoundError,
} = require('../errors/errors');

module.exports.getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(NOT_FOUND_USER_MESSAGE);
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new IncorrectError(`${INCORRECT_ERROR_MESSAGE} при создании пользователя`));
      }
      return next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({ user });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

function updateUser(req, res, info, next) {
  User.findByIdAndUpdate(req.user._id, info, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new NotFoundError(NOT_FOUND_USER_MESSAGE);
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new IncorrectError(`${INCORRECT_ERROR_MESSAGE} при обновлении пользователя`));
      }
      return next(err);
    });
}

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  updateUser(req, res, {
    name,
    about,
  });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUser(req, res, {
    avatar,
  });
};
