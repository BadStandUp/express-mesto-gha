const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_ERROR_MESSAGE } = require('../utils/constants');
const { AuthorizationError } = require('../errors/errors');

module.exports.auth = (req, res, next) => {
  const { auth } = req.headers;
  if (!auth || !auth.startsWith('Bearer ')) {
    throw new AuthorizationError(UNAUTHORIZED_ERROR_MESSAGE);
  }
  const token = auth.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = payload;
  } catch (err) {
    next(new AuthorizationError(UNAUTHORIZED_ERROR_MESSAGE));
  }

  next();
};
