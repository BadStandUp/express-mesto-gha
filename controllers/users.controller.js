const mongoose = require('mongoose');
const { Error } = require('mongoose');
const User = require('../models/user.model');

const {
  DEFAULT_ERROR_CODE,
  DEFAULT_ERROR_MESSAGE,
  NOT_FOUND_CODE,
  NOT_FOUND_USER_MESSAGE,
  CREATED_CODE,
  INCORRECT_ERROR_MESSAGE,
} = require('../utils/constants');

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(CREATED_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new Error(`${INCORRECT_ERROR_MESSAGE} при создании пользователя`));
      }
      return next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.user._id).orFail(() => {
    res.status(NOT_FOUND_CODE).send(NOT_FOUND_USER_MESSAGE);
  })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new Error(`${INCORRECT_ERROR_MESSAGE} пользователя`));
      }
      return next(err);
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

function updateUser(req, res, info, next) {
  User.findByIdAndUpdate(req.user._id, info, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      res.status(NOT_FOUND_CODE).send(NOT_FOUND_USER_MESSAGE);
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new Error(`${INCORRECT_ERROR_MESSAGE} при обновлении пользователя`));
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
