const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_secret;
const issuer = process.env.JWT_issuer;

const getAccessToken = ({ id, email }) => {
  const data = {
    aud: id,
    email,
  };
  const options = {
    expiresIn: 60 * 15, // 15분
    subject: 'userInfo-access',
    issuer,
  };
  return jwt.sign(data, secretKey, options);
};

const getRefreshToken = ({ id }) => {
  const data = {
    aud: id,
  };
  const options = {
    expiresIn: '15d', // 15일
    subject: 'userInfo-refresh',
    issuer,
  };
  return jwt.sign(data, secretKey, options);
};

module.exports = {
  getAccessToken,
  getRefreshToken,
};
