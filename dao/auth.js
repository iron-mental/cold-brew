const pool = require('./db');

const signup = async (userData, next) => {
  const { uid, email, nickname } = userData;
  const sql = `insert into user(uid, email, nickname) values ('${uid}', '${email}', '${nickname}')`;
  try {
    let [rows] = await pool.query(sql);
    return rows;
  } catch (err) {
    throw next({ status: 400, message: err.sqlMessage });
  }
};

module.exports = { signup };
