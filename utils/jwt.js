const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_secret;

const options = {
  issuer: process.env.JWT_issuer,
};

const getAccessToken = ({ id, email }) => {
  const payload = { id, email };

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

const verify = (token) => {
  try {
    return jwt.verify(refresh_token, process.env.JWT_secret);
  } catch (err) {
    throw customError(401, 'Refresh Token이 만료되었습니다. 다시 로그인 하세요.');
  }
};

module.exports = {
  getAccessToken,
  getRefreshToken,
  verify,
};
