const pool = require('./db');
const { customError } = require('../utils/errors/customError');

const createNotice = async (createData) => {
  const conn = await pool.getConnection();
  try {
    const createSQL = 'INSERT INTO notice SET ?';
    const [createRows] = await conn.query(createSQL, createData);
    return createRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const getNotice = async (study_id, notice_id) => {
  const conn = await pool.getConnection();
  try {
    const detailSQL = `
      SELECT
        id, study_id, title, contents, pinned,
        DATE_FORMAT(created_at, "%Y-%c-%d %H:%i:%s") created_at,
        DATE_FORMAT(updated_at, "%Y-%c-%d %H:%i:%s") updated_at
      FROM
        notice
      WHERE
        study_id = ? AND id = ?`;
    const [detailRows] = await conn.query(detailSQL, [study_id, notice_id]);
    return detailRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const noticeUpdate = async (study_id, notice_id, updateData) => {
  const conn = await pool.getConnection();
  try {
    const updateSQL = 'UPDATE notice SET ? WHERE study_id = ? AND id = ?';
    const [updateRows] = await conn.query(updateSQL, [updateData, study_id, notice_id]);
    return updateRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const noticeDelete = async (study_id, notice_id) => {
  const conn = await pool.getConnection();
  try {
    const deleteSQL = 'DELETE FROM notice WHERE study_id = ? AND id = ?';
    const [deleteRows] = await conn.query(deleteSQL, [study_id, notice_id]);
    return deleteRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const getNoticeList = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    const deleteSQL = `
      SELECT id, title, contents, pinned,
        DATE_FORMAT(created_at, "%Y-%c-%d %H:%i:%s") created_at,
        DATE_FORMAT(updated_at, "%Y-%c-%d %H:%i:%s") updated_at
      FROM notice
      WHERE ?`;
    const [deleteRows] = await conn.query(deleteSQL, { study_id });
    return deleteRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const noticePaging = async (noticeKeys) => {
  const params = noticeKeys.concat(noticeKeys);
  const conn = await pool.getConnection();
  try {
    const listSql = `
    SELECT id, title, contents, pinned,
      DATE_FORMAT(created_at, "%Y-%c-%d %H:%i:%s") created_at,
      DATE_FORMAT(updated_at, "%Y-%c-%d %H:%i:%s") updated_at
    FROM notice
    WHERE id in (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ORDER BY FIELD(id, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [listRows] = await conn.query(listSql, params);
    return listRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

module.exports = {
  createNotice,
  getNotice,
  noticeUpdate,
  noticeDelete,
  getNoticeList,
  noticePaging,
};
