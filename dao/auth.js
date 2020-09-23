const pool = require('./db');

const signup = async (body, next) => {
  const conn = await pool.getConnection();
  const sql = 'insert into user set ?';
  try {
    const [rows] = await conn.query(sql, body);
    if (!rows.affectedRows) throw { sqlMessage: '처리결과없음' };
    return rows;
  } catch (err) {
    throw next({ status: 400, message: err.sqlMessage });
  } finally {
    await conn.release();
  }
};

const withdraw = async (body, next) => {
  const conn = await pool.getConnection();
  const sql = `delete from user where ?`;
  try {
    const [rows] = await conn.query(sql, body);
    if (!rows.affectedRows) throw { sqlMessage: '처리결과없음' };
    return rows;
  } catch (err) {
    throw next({ status: 400, message: err.sqlMessage });
  } finally {
    await conn.release();
  }
};

module.exports = { signup, withdraw };
