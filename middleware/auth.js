const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_ERROR_MESSAGE, UNAUTHORIZED_CODE } = require('../utils/constants');

module.exports.auth = (req, res, next) => {
  const { auth } = req.headers;
  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(UNAUTHORIZED_CODE).send({ message: UNAUTHORIZED_ERROR_MESSAGE });
  }
  const token = auth.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, process.env.JWT_TOKEN);

    req.user = payload;
  } catch (err) {
    next(err);
  }

  next();
};
