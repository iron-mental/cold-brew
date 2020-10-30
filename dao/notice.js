const pool = require('./db');

const createNotice = async (createData) => {
  const conn = await pool.getConnection();
  try {
    const createSQL = 'INSERT INTO notice SET ?';
    const [createRows] = await conn.query(createSQL, createData);
    return createRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  } finally {
    await conn.release();
  }
};

const getNotice = async (study_id, notice_id) => {
  const conn = await pool.getConnection();
  try {
    const detailSQL = `SELECT id, study_id, title, contents, pinned,
      DATE_FORMAT(created_at, "%Y-%c-%d %H:%i:%s") created_at,
      DATE_FORMAT(updated_at, "%Y-%c-%d %H:%i:%s") updated_at
      FROM notice 
      WHERE study_id = ? AND id = ?`;
    const [detailRows] = await conn.query(detailSQL, [study_id, notice_id]);
    return detailRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
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
    throw { status: 500, message: err.sqlMessage };
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
    throw { status: 500, message: err.sqlMessage };
  } finally {
    await conn.release();
  }
};

module.exports = {
  createNotice,
  getNotice,
  noticeUpdate,
  noticeDelete,
};
