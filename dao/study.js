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
    await conn.rollback();
    throw { status: 500, message: err.sqlMessage };
  } finally {
    await conn.release();
  }
};

const getStudy = async studyId => {
  try {
    const conn = await pool.getConnection();
    const studySql = `SELECT s.id as studyId, s.category, s.title, s.introduce, s.image, s.progress, s.studyTime, s.location, s.locationDetail, s.snsNotion, s.snsEvernote, s.snsWeb, p.leader
    FROM participate AS p
    LEFT JOIN study AS s
    ON p.studyId = s.id
    WHERE s.id = ?`;
    const [studyRows] = await conn.query(studySql, studyId);
    conn.release();
    return studyRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  }
};

const getNoticeList = async studyId => {
  try {
    const conn = await pool.getConnection();
    const noticeSql = `SELECT id as noticeId, title, contents, pin, createdAt FROM notice WHERE ?`;
    const [noticeRows] = await conn.query(noticeSql, { studyId });
    conn.release();
    return noticeRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  }
};

const getParticipateList = async studyId => {
  try {
    const conn = await pool.getConnection();
    const participateSql = `SELECT u.id as userId, u.image, u.nickname, p.leader
    FROM user AS u
    LEFT JOIN participate AS p
    ON p.studyId = ?`;
    const [participateRows] = await conn.query(participateSql, studyId);
    conn.release();
    return participateRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  }
};

const getApplyList = async studyId => {
  try {
    const conn = await pool.getConnection();
    const applySql = `SELECT u.id as userId, u.image, a.message
      FROM apply AS a
      LEFT JOIN user AS u
      ON a.studyId = studyId
      WHERE studyId = ?`;
    const [apply] = await conn.query(applySql, studyId);
    conn.release();
    return apply;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  }
};

const getImage = async studyId => {
  try {
    const conn = await pool.getConnection();
    const imageSQL = 'SELECT image FROM study WHERE ?';
    const [imageRows] = await conn.query(imageSQL, { id: studyId });
    conn.release();
    return imageRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  }
};

const studyUpdate = async (studyId, updateData) => {
  try {
    const conn = await pool.getConnection();
    const updateSQL = 'UPDATE study SET ? WHERE ?';
    const [updateRows] = await conn.query(updateSQL, [updateData, { id: studyId }]);
    conn.release();
    return updateRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  }
};

module.exports = { createStudy, getStudy, getNoticeList, getApplyList, getParticipateList, getImage, studyUpdate };
