const pool = require('./db');
const { databaseError } = require('../utils/errors/database');
const { multiInsertQuery } = require('../utils/query');
const { DBTableEnum } = require('../utils/variables/enum');

const getMemberToken = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    const getMemberSql = `
      SELECT
        u.id, u.device, u.push_token
      FROM
        participate p
          LEFT JOIN user u
          ON p.user_id = u.id
      WHERE p.study_id = ?
      ORDER BY u.device`;
    const [memberRows] = await conn.query(getMemberSql, study_id);
    return memberRows;
  } catch (err) {
    throw databaseError(500, err);
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
    throw databaseError(500, err);
  } finally {
    await conn.release();
  }
};

const getOffMemberToken = async (study_id, nickname) => {
  const conn = await pool.getConnection();
  try {
    const getMemberSql = `
      SELECT
        u.id, u.device, u.push_token
      FROM
        participate p
          LEFT JOIN user u
          ON p.user_id = u.id
      WHERE p.study_id = ? AND p.chat_status = false AND nickname != ?
      ORDER BY u.device`;
    const [offMemberRows] = await conn.query(getMemberSql, [study_id, nickname]);
    return offMemberRows;
  } catch (err) {
    throw databaseError(500, err);
  } finally {
    await conn.release();
  }
};

const getUserToken = async (user_id) => {
  const conn = await pool.getConnection();
  try {
    const getTokenSql = `
      SELECT id, device, push_token
      FROM user
      WHERE id = ?`;
    const [tokenRows] = await conn.query(getTokenSql, user_id);
    return tokenRows;
  } catch (err) {
    throw databaseError(500, err);
  } finally {
    await conn.release();
  }
};

const getHostToken = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    const getTokenSql = `
      SELECT
        u.id, u.device, u.push_token
      FROM user u
        LEFT JOIN participate p
        ON u.id = p.user_id
      WHERE p.study_id = ? AND p.leader = true`;
    const [tokenRows] = await conn.query(getTokenSql, study_id);
    return tokenRows;
  } catch (err) {
    throw databaseError(500, err);
  } finally {
    await conn.release();
  }
};

const insertAlert = async (insertData) => {
  const insertSql = multiInsertQuery(DBTableEnum.alert, insertData);
  const conn = await pool.getConnection();
  try {
    const [insertRows] = await conn.query(insertSql);
    return insertRows;
  } catch (err) {
    throw databaseError(500, err);
  } finally {
    await conn.release();
  }
};

const getMemberWithoutUserToken = async (study_id, user_id) => {
  const conn = await pool.getConnection();
  try {
    const getMemberSql = `
      SELECT
        u.id, u.device, u.push_token
      FROM
        participate p
          LEFT JOIN user u
          ON p.user_id = u.id
      WHERE p.study_id = ? AND u.id != ?
      ORDER BY u.device`;
    const [memberRows] = await conn.query(getMemberSql, [study_id, user_id]);
    return memberRows;
  } catch (err) {
    throw databaseError(500, err);
  } finally {
    await conn.release();
  }
};
module.exports = {
  getMemberToken,
  getMemberWithoutHostToken,
  getMemberWithoutUserToken,
  getOffMemberToken,
  getUserToken,
  getHostToken,
  insertAlert,
};
