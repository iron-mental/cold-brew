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

const studyDetail = async studyId => {
  let data = {};
  try {
    const conn = await pool.getConnection();
    const studySql = `SELECT category, title, introduce, image, progress, studyTime, location, locationDetail, snsNotion, snsEvernote, snsWeb
      FROM study 
      WHERE ?`;
    const [study] = await conn.query(studySql, { id: studyId });
    data = study[0];

    const participateSql = `SELECT u.image, u.nickname, p.leader
      FROM user AS u
      LEFT JOIN participate AS p
      ON p.studyId = ?`;
    const [participate] = await conn.query(participateSql, studyId);
    data.participate = participate;

    // if (방장이면) {
    //   const applySql = `SELECT u.image, u.nickname, a.message
    //   FROM user AS u
    //   LEFT JOIN apply AS a
    //   ON a.studyId = ?`;
    //   const [apply] = await conn.query(applySql, studyId);
    //   console.log('apply: ', apply);
    //   data.apply = apply;
    // }
    conn.release();
    return data;
  } catch (err) {
    console.error('err: ', err);
    throw { status: 500, message: 'DB Error' };
  }
};

module.exports = { createStudy, studyDetail };
