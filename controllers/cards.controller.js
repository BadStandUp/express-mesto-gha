const Card = require('../models/card.model');

const {
  DEFAULT_ERROR_CODE,
  DEFAULT_ERROR_MESSAGE,
  NOT_FOUND_CODE,
  NOT_FOUND_CARD_MESSAGE_MESSAGE,
} = require('../utils/constants');

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  Card.create({name, link, owner: req.user._id})
    .then(card => res.send({data: card}))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({message: DEFAULT_ERROR_MESSAGE}))
}

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(card => res.send({data: card}))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({message: DEFAULT_ERROR_MESSAGE}))
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).orFail(() => {
    res.status(NOT_FOUND_CODE);
    res.send(NOT_FOUND_CARD_MESSAGE_MESSAGE)
  })
    .then(card => res.send({data: card}))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({message: DEFAULT_ERROR_MESSAGE}))
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true},
  ).orFail(() => {
    res.status(NOT_FOUND_CODE);
    res.send(NOT_FOUND_CARD_MESSAGE_MESSAGE)
  }).then((user) => {
    res.send({user})
  }).catch(() => res.status(DEFAULT_ERROR_CODE).send({message: DEFAULT_ERROR_MESSAGE}))
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true},
  ).orFail(() => {
    res.status(NOT_FOUND_CODE);
    res.send(NOT_FOUND_CARD_MESSAGE_MESSAGE)
  }).then((user) => {
    res.send({user})
  }).catch(() => res.status(DEFAULT_ERROR_CODE).send({message: DEFAULT_ERROR_MESSAGE}))
}