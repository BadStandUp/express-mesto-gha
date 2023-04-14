const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then((user) => {
      res.send({data: user})
    })
    .catch(() => {
      res.status(500).send({message: 'Произошла ошибка'})
    })
}

module.exports.getUserById = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({user})
    })
    .catch(() => {
      res.status(500).send({message: 'Произошла ошибка'})
    })
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({data: users})
    })
    .catch(() => {
      res.status(500).send({message: 'Произошла ошибка'})
    })
}

function updateUser(req, res, info) {
  User.findByIdAndUpdate(req.user._id, info)
    .then((user) => {
      res.send({data: user})
    })
    .catch(() => {
      res.status(500).send({message: 'Произошла ошибка'})
    })
}

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  updateUser(req, res ,{
    name,
    about
  })
}

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUser(req, res, {
    avatar
  })
}