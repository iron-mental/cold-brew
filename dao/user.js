const pool = require('./db');

const signup = async body => {
  try {
    const conn = await pool.getConnection();
    try {
      const sql = 'INSERT INTO user SET ?';
      const [rows] = await conn.query(sql, body);
      return rows;
    } catch (err) {
      throw { status: 500, message: 'DB Query Error' };
    } finally {
      conn.release();
    }
  } catch (err) {
    if (err.status) {
      throw err;
    }
    throw { status: 500, message: 'DB Connection Error' };
  }
};

const withdraw = async params => {
  try {
    const conn = await pool.getConnection();
    try {
      const sql = `DELETE FROM user WHERE ?`;
      const [rows] = await conn.query(sql, params);
      return rows;
    } catch (err) {
      throw { status: 400, message: 'DB Query Error' };
    } finally {
      conn.release();
    }
  } catch (err) {
    if (err.status) {
      throw err;
    }
    throw { status: 400, message: 'DB Connection Error' };
  }
};

module.exports = { signup, withdraw };
