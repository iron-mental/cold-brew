const pool = require('./db');
const { customError } = require('../utils/errors/customError');

const isHost = async (user_id, study_id) => {
  const conn = await pool.getConnection();
  try {
    const studyListSql = `
      SELECT EXISTS (
        SELECT user_id
        FROM participate
        WHERE leader = true and user_id = ? and study_id = ? ) isHost
    `;
    const [listRows] = await conn.query(studyListSql, [user_id, study_id]);
    return listRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const checkMember = async (user_id, study_id) => {
  const conn = await pool.getConnection();
  try {
    const studyListSql = `
      SELECT user_id, leader
      FROM participate
      WHERE user_id = ? and study_id = ?
    `;
    const [listRows] = await conn.query(studyListSql, [user_id, study_id]);
    return listRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const checkApply = async (user_id, study_id) => {
  const conn = await pool.getConnection();
  try {
    const studyListSql = `
      SELECT user_id, rejected_status
      FROM apply
      WHERE user_id = ? and study_id = ?
    `;
    const [listRows] = await conn.query(studyListSql, [user_id, study_id]);
    return listRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const getUserLocation = async (user_id) => {
  const conn = await pool.getConnection();
  try {
    const checkSql = 'SELECT latitude, longitude, sigungu FROM user WHERE id = ?';
    const [checkRows] = await conn.query(checkSql, user_id);
    return checkRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

module.exports = {
  isHost,
  checkMember,
  checkApply,
  getUserLocation,
};
