const router = require('express').Router();

const userRouter = require('./users.router');
const cardRouter = require('./cards.router');
const authRouter = require('./auth.router');

const { auth } = require('../middleware/auth');

const { NOT_FOUND_CODE, NOT_FOUND_ERROR_MESSAGE } = require('../utils/constants');

router.use('/', authRouter);
router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.use('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_ERROR_MESSAGE });
});

module.exports = router;
