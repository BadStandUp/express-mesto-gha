const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserById,
  getUsers,
  updateUserInfo,
  updateAvatar,
  getUser,
} = require('../controllers/users.controller');

router.get('/me', getUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

router.get('/', getUsers);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri().regex(/^https?:\/\//i),
  }),
}), updateAvatar);

module.exports = router;
