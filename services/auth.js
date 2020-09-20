var authDao = require('../dao/auth');

const signup = async userData => {
  return await authDao.signup(userData);
};

module.exports = { signup };
