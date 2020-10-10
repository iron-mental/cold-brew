const pool = require('./db');

const createNotice = async createData => {
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

const noticeDetail = async (studyId, noticeId) => {
  try {
    const conn = await pool.getConnection();
    const detailSQL = 'SELECT * FROM notice WHERE studyId = ? and id = ?';
    const [detailRows] = await conn.query(detailSQL, [studyId, noticeId]);
    await conn.release();
    return detailRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  }
};

const noticeUpdate = async (studyId, noticeId, updateData) => {
  try {
    const conn = await pool.getConnection(); 
    const updateSQL = 'UPDATE notice SET ? WHERE studyId = ? and id = ?';
    const [detailRows] = await conn.query(updateSQL, [updateData, studyId, noticeId]);
    await conn.release();
    return detailRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  }
};

module.exports = {
  createNotice,
  noticeDetail,
  noticeUpdate
};
