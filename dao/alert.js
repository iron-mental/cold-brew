const pool = require('../configs/mysql');
const { databaseError } = require('../utils/errors/database');

const getAlert = async (user_id) => {
  const conn = await pool.getConnection();
  try {
    const alertSql = `
      SELECT id, study_id, study_title, pushEvent, message, confirm, DATE_FORMAT(created_at, "%Y-%c-%d %H:%i:%s") created_at
      FROM alert
      WHERE user_id = ?
      ORDER BY id DESC
      LIMIT 50`;
    const [alertRows] = await conn.query(alertSql, [user_id]);
    return alertRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const confirmAlert = async (alert_id) => {
  const conn = await pool.getConnection();
  try {
    const confirmSql = `
      UPDATE alert 
      SET confirm = ? 
      WHERE id = ?`;
    const [confirmRows] = await conn.query(confirmSql, [true, alert_id]);
    return confirmRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const updateStudyTitle = async (study_id, title) => {
  const conn = await pool.getConnection();
  try {
    const updateSql = `
      UPDATE alert 
      SET study_title = ? 
      WHERE study_id = ?`;
    const [updateRows] = await conn.query(updateSql, [title, study_id]);
    return updateRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

module.exports = {
  getAlert,
  confirmAlert,
  updateStudyTitle,
};
