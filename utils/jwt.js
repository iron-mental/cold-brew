const jwt = require('jsonwebtoken');
const { customError } = require('./errors/custom');

const secretKey = process.env.JWT_secret;
const options = {
  issuer: process.env.JWT_issuer,
};

const verify = (token, tokenType) => {
  try {
    return jwt.verify(token, process.env.JWT_secret);
  } catch (err) {
    throw customError(401, `${tokenType} Token이 만료되었습니다. 다시 로그인 하세요`, 106);
  }
};

const getAccessToken = ({ id, email, nickname }) => {
  const payload = { id, email, nickname };
  options.expiresIn = parseInt(process.env.JWT_accessExpire, 10); // 15분
  options.subject = 'userInfo-access';
  return jwt.sign(payload, secretKey, options);
};

const getRefreshToken = ({ id }) => {
  const payload = { id };
  options.expiresIn = process.env.JWT_refreshExpire; // 15일
  options.subject = 'userInfo-refresh';
  return jwt.sign(payload, secretKey, options);
};

const socketVerify = (socket, next) => {
  if (socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, process.env.JWT_secret, (err, decoded) => {
      if (err) {
        return next(err);
      }
      socket.decoded = decoded;
      return next();
    });
  } else {
    return next('not exist token');
  }
};

module.exports = {
  verify,
  getAccessToken,
  getRefreshToken,
  socketVerify,
};
