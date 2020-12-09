const pool = require('./db');
const { customError } = require('../utils/errors/customError');

const getPushInfo = async (members) => {
  const conn = await pool.getConnection();
  try {
    const pushSql = `
      SELECT
        id, device, push_token
      FROM
        user
      WHERE
        id in (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [pushInfoRows] = await conn.query(pushSql, members);
    return pushInfoRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

module.exports = { getPushInfo };
