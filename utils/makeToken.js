const jwt = require('jsonwebtoken');

const secretKey = 'cjfdkcnldjqgkwk';

const AccessToken = (uid, user_id, user_name) => {
  const data = {
    aud: uid,
    user_id,
    user_name,
  };
  const options = {
    expiresIn: 60 * 15, // 15분
    issuer: 'terminal-server',
    subject: 'userInfo-Access',
  };
  const token = jwt.sign(data, secretKey, options);
  return token;
};

const RefreshToken = () => {
  const data = {
    aud: uid,
    user_id,
    user_name,
  };
  const options = {
    expiresIn: '15d', // 15일
    issuer: 'terminal-server',
    subject: 'userInfo-Access',
  };
  return jwt.sign(data, secretKey, options);
};

module.exports = {
  AccessToken,
  RefreshToken,
};
