const pool = require('./db');
const { customError } = require('../utils/errors/customError');

const getMembers = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    const getMemberSql = `
      SELECT
        u.device, u.push_token
      FROM
        participate p
          LEFT JOIN user u
          ON p.user_id = u.id
      WHERE p.study_id = ? AND nickname != ?
      ORDER BY u.device`;
    const [memberRows] = await conn.query(getMemberSql, [study_id, nickname]);
    return memberRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const getOffMembers = async (study_id, nickname) => {
  const conn = await pool.getConnection();
  try {
    const getMemberSql = `
      SELECT
        u.device, u.push_token
      FROM
        participate p
          LEFT JOIN user u
          ON p.user_id = u.id
      WHERE p.study_id = ? AND p.chat_status = false AND nickname != ?
      ORDER BY u.device`;
    const [offMemberRows] = await conn.query(getMemberSql, [study_id, nickname]);
    return offMemberRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

module.exports = {
  getMembers,
  getOffMembers,
};
