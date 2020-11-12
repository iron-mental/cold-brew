const jwt = require('jsonwebtoken');

const { authError } = require('../utils/errors/customError');

const exception = ['check-nickname', 'check-email', 'login', 'reset-password'];

const verify = async (req, res, next) => {
  // 토큰이 없어도 되는 APIs 확인
  if (exception.indexOf(req.url.split('/')[3]) > -1 || req.url === '/v1/user') {
    return next();
  }
  // 토큰 유무 확인
  else if (req.headers.authorization) {
    req.jwt = req.headers.authorization.split(' ')[1];
    try {
      const decoded = await jwt.verify(req.jwt, process.env.JWT_secret);
      req.user = decoded;
      return next();
    } catch (err) {
      return authError(next, err);
    }
  }
  // 나머지 에러처리
  else {
    return authError(next, { message: 'jwt not exist' });
  }
};

module.exports = {
  verify,
};
