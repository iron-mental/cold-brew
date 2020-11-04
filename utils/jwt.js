require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_secret;

const accessToken = ({ id, email }) => {
  const data = {
    aud: id,
    email,
  };
  const options = {
    expiresIn: 60 * 15, // 15분
    subject: 'userInfo-Access',
    issuer: process.env.JWT_issuer,
  };
  return jwt.sign(data, secretKey, options);
};

const refreshToken = (user_id, email) => {
  const data = {
    aud: user_id,
    email,
  };
  const options = {
    expiresIn: '15d', // 15일
    subject: 'userInfo-Refresh',
    issuer: process.env.JWT_issuer,
  };
  return jwt.sign(data, secretKey, options);
};

module.exports = {
  accessToken,
  refreshToken,
};
