var authDao = require('../dao/auth');

const signup = async (body, next) => {
  const rows = await authDao.signup(body, next);
  if (!rows.affectedRows) throw next({ status: 400, message: '처리결과 없음' });
  return rows;
};

const withdraw = async (uid, next) => {
  const rows = await authDao.withdraw(uid, next);
  if (!rows.affectedRows) throw next({ status: 400, message: '처리결과 없음' });

  return rows;
};

module.exports = { signup, withdraw };
