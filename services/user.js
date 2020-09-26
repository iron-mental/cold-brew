const userDao = require('../dao/user');

const signup = async body => {
  const rows = await userDao.signup(body);
  if (!rows.affectedRows) {
    throw {
      status: 400,
      message: 'no result',
    };
  }
};

const withdraw = async params => {
  const rows = await userDao.withdraw(params);
  if (!rows.affectedRows) {
    throw {
      status: 400,
      message: 'no result',
    };
  }
};

module.exports = { signup, withdraw };
