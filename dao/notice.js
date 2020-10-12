const pool = require('./db');

const createNotice = async (createData) => {
  try {
    const conn = await pool.getConnection();
    const createSQL = 'INSERT INTO notice SET ?';
    const [createRows] = await conn.query(createSQL, createData);
    await conn.release();
    return createRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  }
};

const noticeDetail = async (study_id, notice_id) => {
  try {
    const conn = await pool.getConnection();
    const detailSQL = `SELECT id, study_id, title, contents, pined,
      FROM_UNIXTIME(UNIX_TIMESTAMP(created_at),'%Y-%m-%d %H:%i:%s') as created_at,
      FROM_UNIXTIME(UNIX_TIMESTAMP(updated_at),'%Y-%m-%d %H:%i:%s') as updated_at 
      FROM notice 
      WHERE study_id = ? AND id = ?`;
    const [detailRows] = await conn.query(detailSQL, [study_id, notice_id]);
    await conn.release();
    return detailRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  }
};

const noticeUpdate = async (study_id, notice_id, updateData) => {
  try {
    const conn = await pool.getConnection();
    const updateSQL = 'UPDATE notice SET ? WHERE study_id = ? AND id = ?';
    const [updateRows] = await conn.query(updateSQL, [updateData, study_id, notice_id]);
    await conn.release();
    return updateRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  }
};

const noticeDelete = async (study_id, notice_id) => {
  try {
    const conn = await pool.getConnection();
    const deleteSQL = 'DELETE FROM notice WHERE study_id = ? AND id = ?';
    const [deleteRows] = await conn.query(deleteSQL, [study_id, notice_id]);
    await conn.release();
    return deleteRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  }
};

module.exports = {
  createNotice,
  noticeDetail,
  noticeUpdate,
  noticeDelete,
};
