const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  Card.create({name, link, owner: req.user._id})
    .then(card => res.send({data: card}))
    .catch(err => res.status(500).send({message: err}))
}

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(card => res.send({data: card}))
    .catch(err => res.status(500).send({message: err}))
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.send({data: card}))
    .catch(err => res.status(500).send({message: err}))
}

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)