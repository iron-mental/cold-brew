const pool = require('../configs/mysql');
const { databaseError } = require('../utils/errors/database');

const isHost = async (user_id, study_id) => {
  const conn = await pool.getConnection();
  try {
    const studyListSql = `
      SELECT EXISTS (
        SELECT user_id
        FROM participate
        WHERE leader = true
          AND user_id = ?
          AND study_id = ? ) AS isHost
    `;
    const [listRows] = await conn.query(studyListSql, [user_id, study_id]);
    return listRows;
  } catch (err) {
    throw databaseError(err);
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
      WHERE user_id = ?
        AND study_id = ?
    `;
    const [listRows] = await conn.query(studyListSql, [user_id, study_id]);
    return listRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const checkApply = async (user_id, study_id) => {
  const conn = await pool.getConnection();
  try {
    const studyListSql = `
      SELECT user_id, apply_status
      FROM apply
      WHERE user_id = ?
        AND study_id = ?
      ORDER BY id DESC
      LIMIT 1
    `;
    const [listRows] = await conn.query(studyListSql, [user_id, study_id]);
    return listRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getUserLocation = async (user_id) => {
  const conn = await pool.getConnection();
  try {
    const checkSql = `
      SELECT latitude, longitude, sigungu 
      FROM user
      WHERE id = ?`;
    const [checkRows] = await conn.query(checkSql, [user_id]);
    return checkRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const checkVersion = async (version, device) => {
  const conn = await pool.getConnection();
  try {
    const checkSql = `
      SELECT V.id, V.device, V.version, V.force
      FROM version V
      WHERE id > (
        SELECT id 
        FROM version 
        WHERE version = ?
          AND device = ? )
        AND device = ?`;
    const [checkRows] = await conn.query(checkSql, [version, device, device]);
    return checkRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

module.exports = {
  isHost,
  checkMember,
  checkApply,
  getUserLocation,
  checkVersion,
};
