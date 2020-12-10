const pool = require('./db');
const { databaseError } = require('../utils/errors/database');

const createNotice = async (createData) => {
  const conn = await pool.getConnection();
  try {
    const createSQL = 'INSERT INTO notice SET ?';
    const [createRows] = await conn.query(createSQL, createData);
    return createRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getNotice = async (study_id, notice_id) => {
  const conn = await pool.getConnection();
  try {
    const detailSQL = `
      SELECT
        n.id, n.study_id, n.title, n.contents, n.pinned, p.user_id leader_id, u.image leader_image, u.nickname leader_nickname,
        DATE_FORMAT(n.updated_at, "%Y-%c-%d %H:%i:%s") updated_at
      FROM notice n
        LEFT JOIN participate p
        ON n.study_id = p.study_id
        LEFT JOIN user u
        ON u.id = p.user_id
      WHERE
        n.study_id = ? AND n.id = ? AND leader = ?;`;
    const [detailRows] = await conn.query(detailSQL, [study_id, notice_id, true]);
    return detailRows;
  } catch (err) {
    throw databaseError(err);
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
    throw databaseError(err);
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
    throw databaseError(err);
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
      WHERE ?
      ORDER BY  pinned DESC, id DESC`;
    const [deleteRows] = await conn.query(deleteSQL, { study_id });
    return deleteRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const noticePaging = async (noticeKeys) => {
  const keys = noticeKeys.concat(noticeKeys);
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
    const [listRows] = await conn.query(listSql, keys);
    return listRows;
  } catch (err) {
    throw databaseError(err);
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
