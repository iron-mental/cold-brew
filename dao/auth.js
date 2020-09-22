const pool = require('./db');

const signup = async (body, next) => {
  const { uid, email, nickname } = body;
  const sql = `insert into user(uid, email, nickname) values ('${uid}', '${email}', '${nickname}')`;
  try {
    const [rows] = await pool.query(sql);
    return rows;
  } catch (err) {
    throw next({ status: 400, message: err.sqlMessage });
  }
};

const withdraw = async (body, next) => {
  const { uid } = body;
  const sql = `delete from user where uid = '${uid}'`;
  try {
    const [rows] = await pool.query(sql);
    return rows;
  } catch (err) {
    throw next({ status: 400, message: err.sqlMessage });
  }
};

module.exports = { signup, withdraw };
