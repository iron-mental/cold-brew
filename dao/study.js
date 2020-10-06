const fs = require('fs');

const pool = require('./db');

const createStudy = async (userId, createData, filePath) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const createSQL = 'INSERT INTO study SET ?'; // study insert
    const [createRows] = await conn.query(createSQL, createData);
    const { insertId } = createRows;

    const participateSQL = 'INSERT INTO participate SET ?'; // participate insert
    const participateData = { userId, studyId: insertId, leader: true };
    await conn.query(participateSQL, participateData);

    await conn.commit();
    return createRows;
  } catch (err) {
    console.error('err: ', err);
    await conn.rollback();
    // 이미지 삭제
    fs.unlink(filePath, err => {
      console.error('err: ', err);
    });
    throw { status: 500, message: err.sqlMessage };
  } finally {
    await conn.release();
  }
};

const studyDetail = async studyId => {
  let data = {};
  try {
    const conn = await pool.getConnection();
    const studySql = `SELECT id, category, title, introduce, image, progress, studyTime, location, locationDetail, snsNotion, snsEvernote, snsWeb
      FROM study 
      WHERE ?`;
    const [studyRows] = await conn.query(studySql, { id: studyId });
    data = studyRows[0];

    const participateSql = `SELECT u.image, u.nickname, p.leader
      FROM user AS u
      LEFT JOIN participate AS p
      ON p.studyId = ?`;
    const [participateRows] = await conn.query(participateSql, studyId);
    data.participate = participateRows;

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
    throw { status: 500, message: err.sqlMessage };
  }
};

const studyUpdate = async (studyId, updateData, filePath) => {
  try {
    const conn = await pool.getConnection();

    const imageSQL = 'SELECT image FROM study WHERE ?';
    const [imageRows] = await conn.query(imageSQL, { id: studyId });

    const updateSQL = 'UPDATE study SET ? WHERE ?';
    const [updateRows] = await conn.query(updateSQL, [updateData, { id: studyId }]);

    conn.release();
    return [updateRows, imageRows[0].image];
  } catch (err) {
    console.error(err);
    fs.unlink(filePath, err => {}); // _tmp 파일 삭제
    throw { status: 500, message: err.sqlMessage };
  }
};

module.exports = { createStudy, studyDetail, studyUpdate };
