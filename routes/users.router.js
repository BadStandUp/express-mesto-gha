const router = require('express').Router();

const {
  createUser,
  getUserById,
  getUsers,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users.controller');

router.post('/', createUser);
router.get('/:userId', getUserById);
router.get('/', getUsers);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
