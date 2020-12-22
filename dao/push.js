const pool = require('./db');
const { customError } = require('../utils/errors/custom');

const getMemberToken = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    const getMemberSql = `
      SELECT
        u.device, u.push_token
      FROM
        participate p
          LEFT JOIN user u
          ON p.user_id = u.id
      WHERE p.study_id = ?
      ORDER BY u.device`;
    const [memberRows] = await conn.query(getMemberSql, study_id);
    return memberRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const getMemberWithoutHostToken = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    const getMemberSql = `
      SELECT
        u.id, u.device, u.push_token
      FROM
        participate p
          LEFT JOIN user u
          ON p.user_id = u.id
      WHERE p.study_id = ? AND p.leader = ?
      ORDER BY u.device`;
    const [memberRows] = await conn.query(getMemberSql, [study_id, false]);
    return memberRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const getOffMemberToken = async (study_id, nickname) => {
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

const getUserToken = async (user_id) => {
  const conn = await pool.getConnection();
  try {
    const getTokenSql = `
      SELECT device, push_token
      FROM user
      WHERE id = ?`;
    const [tokenRows] = await conn.query(getTokenSql, user_id);
    return tokenRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const getHostToken = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    const getTokenSql = `
      SELECT u.device, u.push_token
      FROM user u
        LEFT JOIN participate p
        ON u.id = p.user_id
      WHERE p.study_id = ? AND p.leader = true`;
    const [tokenRows] = await conn.query(getTokenSql, study_id);
    return tokenRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

module.exports = {
  getMemberToken,
  getMemberWithoutHostToken,
  getOffMemberToken,
  getUserToken,
  getHostToken,
};
