const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_secret;
const options = {
  issuer: process.env.JWT_issuer,
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_secret);
  } catch (err) {
    return {
      err: true,
    };
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

const getPayload = (jwt_token) => {
  const payload = Buffer.from(jwt_token.split('.')[1], 'base64').toString();
  return JSON.parse(payload);
};

module.exports = {
  verifyRefreshToken,
  getAccessToken,
  getRefreshToken,
  socketVerify,
  getPayload,
};
