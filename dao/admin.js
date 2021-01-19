const pool = require('./db');

const { databaseError } = require('../utils/errors/database');

const getUserList = async () => {
  const conn = await pool.getConnection();
  try {
    const userListSql = 'SELECT id FROM user';
    const [userListRows] = await conn.query(userListSql);
    return userListRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getUserStudyList = async (user_id) => {
  const conn = await pool.getConnection();
  try {
    const studyListSql = `
      SELECT study_id id
      FROM participate
      WHERE ?`;
    const [studyListRows] = await conn.query(studyListSql, { user_id });
    return studyListRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

module.exports = {
  getUserList,
  getUserStudyList,
};
