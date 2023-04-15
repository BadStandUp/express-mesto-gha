const User = require('../models/user.model');

const {
  DEFAULT_ERROR_CODE,
  DEFAULT_ERROR_MESSAGE,
  NOT_FOUND_CODE,
  NOT_FOUND_USER_MESSAGE,
  CREATED_CODE,
} = require('../utils/constants');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(CREATED_CODE).send({ data: user });
    })
    .catch(() => {
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.user._id).orFail(() => {
    res.status(NOT_FOUND_CODE);
    res.send(NOT_FOUND_USER_MESSAGE);
  })
    .then((user) => {
      res.send({ user });
    })
    .catch(() => {
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
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

function updateUser(req, res, info) {
  User.findByIdAndUpdate(req.user._id, info, {
    new: true,
    runValidators: true,
  }).orFail(() => {
    res.status(NOT_FOUND_CODE);
    res.send(NOT_FOUND_USER_MESSAGE);
  })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => {
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
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
