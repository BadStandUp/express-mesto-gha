const Card = require('../models/card.model');

const {
  DEFAULT_ERROR_CODE,
  DEFAULT_ERROR_MESSAGE,
  NOT_FOUND_CODE,
  NOT_FOUND_CARD_MESSAGE_MESSAGE,
  CREATED_CODE,
} = require('../utils/constants');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(CREATED_CODE).send({ data: card });
    })
    .catch(() => {
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send({ data: card });
    })
    .catch(() => {
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).orFail(() => {
    res.status(NOT_FOUND_CODE);
    res.send(NOT_FOUND_CARD_MESSAGE_MESSAGE);
  })
    .then((card) => {
      res.send({ data: card });
    })
    .catch(() => {
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
};

function changeLike(req, res, action) {
  Card.findByIdAndUpdate(req.params.cardId, action, { new: true })
    .populate('likes')
    .orFail(() => {
      res.status(NOT_FOUND_CODE);
      res.send(NOT_FOUND_CARD_MESSAGE_MESSAGE);
    })
    .then((user) => {
      res.send({ user });
    })
    .catch(() => {
      res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
    });
}

module.exports.likeCard = (req, res) => {
  changeLike(req, res, { $addToSet: { likes: req.user._id } });
};

module.exports.dislikeCard = (req, res) => {
  changeLike(req, res, { $pull: { likes: req.user._id } });
};
