const pool = require('./db');

const createNotice = async createData => {
  try {
    const conn = await pool.getConnection();
    const createSQL = 'INSERT INTO notice SET ?'; // study insert
    const [createRows] = await conn.query(createSQL, createData);
    await conn.release();
    return createRows;
  } catch (err) {
    console.error('err: ', err);
    throw { status: 500, message: err.sqlMessage };
  }
};

const noticeDetail = async (studyId, noticeId) => {
  try {
    const conn = await pool.getConnection();
    const detailSQL = 'SELECT * FROM notice WHERE studyId = ? and id = ?'; // study insert
    const [detailRows] = await conn.query(detailSQL, [studyId, noticeId]);
    await conn.release();
    return detailRows;
  } catch (err) {
    console.error('err: ', err);
    throw { status: 500, message: err.sqlMessage };
  }
};

module.exports = {
  createNotice,
  noticeDetail,
};
