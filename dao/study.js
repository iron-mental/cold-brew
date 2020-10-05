const pool = require('./db');

const createStudy = async (userId, createData) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const createSQL = 'INSERT INTO study SET ?'; // study 테이블
    const [createRows] = await conn.query(createSQL, createData);
    const { insertId } = createRows;

    const participateSQL = 'INSERT INTO participate SET ?'; // participate 테이블
    const participateData = { userId, studyId: insertId, leader: true };
    const [participateRows] = await conn.query(participateSQL, participateData);

    await conn.commit();
    return participateRows;
  } catch (err) {
    console.error('err: ', err);
    await conn.rollback();
    throw { status: 500, message: err.sqlMessage };
  } finally {
    await conn.release();
  }
};

module.exports = { createStudy };
