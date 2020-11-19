const jwt = require('jsonwebtoken');

const { authError } = require('../utils/errors/customError');

const exceptionList = ['check-nickname', 'check-email', 'login', 'reset-password', 'reissuance'];

const verify = async (req, res, next) => {
  if (exceptionList.indexOf(req.url.split('/')[3]) > -1 || ['/v1/user', '/v1/chat'].indexOf(req.url)) {
    return next();
  }

  if (req.headers.authorization) {
    req.jwt = req.headers.authorization.split(' ')[1];
    try {
      req.user = await jwt.verify(req.jwt, process.env.JWT_secret);
      return next();
    } catch (err) {
      return authError(next, err);
    }
  }
  return authError(next, { message: 'jwt not exist' });
};

const idCompare = (req, res, next) => {
  const id = req.params.id || req.params.user_id;
  if (req.user.id !== parseInt(id, 10)) {
    return authError(next, { message: '권한이 없습니다' });
  }
  next();
};

module.exports = {
  verify,
  idCompare,
};
