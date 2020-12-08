const { AuthError } = require('../../utils/errors/auth');

const authErrorHandler = (err, req, res, next) => {
  if (err instanceof AuthError) {
    return res.status(401).json(err);
  }
  return next(err);
};

module.exports = {
  authErrorHandler,
};
