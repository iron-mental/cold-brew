const jwt = require('jsonwebtoken');

const { authError } = require('../utils/errors/auth');
const { categoryEnum } = require('../utils/variables/enums');

const exceptionList = [
  ['check-nickname', 'check-email', 'login', 'reset-password', 'reissuance'].concat(Object.keys(categoryEnum)),
  ['/v1/user', '/v1/chat', '/v1/push/test'],
];

const verify = async (req, res, next) => {
  if (exceptionList[0].indexOf(req.url.split('/')[3]) > -1 || exceptionList[1].indexOf(req.url) > -1) {
    return next();
  }

  if (req.headers.authorization) {
    req.jwt = req.headers.authorization.split(' ')[1];
    try {
      req.user = await jwt.verify(req.jwt, process.env.JWT_secret);
      return next();
    } catch (err) {
      return next(authError(err));
    }
  }
  return next(authError({ message: 'jwt not exist' }));
};

const idCompare = (req, res, next) => {
  const id = req.params.id || req.params.user_id;
  if (req.user.id !== parseInt(id, 10)) {
    next(authError({ message: 'permission error' }));
  }
  next();
};

module.exports = {
  verify,
  idCompare,
};
