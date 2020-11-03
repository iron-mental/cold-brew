const pool = require('./db');

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
    const detailSQL = `SELECT id, study_id, title, contents, pinned,
      FROM_UNIXTIME(UNIX_TIMESTAMP(created_at),'%Y-%m-%d %H:%i:%s') AS created_at,
      FROM_UNIXTIME(UNIX_TIMESTAMP(updated_at),'%Y-%m-%d %H:%i:%s') AS updated_at 
      FROM notice 
      WHERE study_id = ? AND id = ?`;
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

module.exports = {
  createNotice,
  getNotice,
  noticeUpdate,
  noticeDelete,
};
