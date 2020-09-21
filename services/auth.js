var authDao = require('../dao/auth');

const signup = async (userData, next) => {
  return await authDao.signup(userData, next);
};

module.exports = { signup };
