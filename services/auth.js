var authDao = require('../dao/auth');

const signup = async (body, next) => {
  return await authDao.signup(body, next);
};

const withdraw = async (uid, next) => {
  return await authDao.withdraw(uid, next);
};

module.exports = { signup, withdraw };
