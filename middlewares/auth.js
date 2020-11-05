const jwt = require('jsonwebtoken');

const { authError } = require('../utils/errors/customError');

const exception = ['check-nickname', 'check-email', 'login', 'reset-password', 'reissuance'];

const verify = async (req, res, next) => {
  const path = req.url.split('/')[3];

  // 토큰이 없어도 되는 APIs 확인
  if (exception.indexOf(path) > -1 || req.url === '/v1/user') {
    return next();
  }
  // 토큰 유무 확인
  else if (req.headers.authorization) {
    try {
      const decoded = await jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_secret);
      res.user = decoded;
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
