const pool = require('./db');

const createStudy = async (userId, createData) => {
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
    const studySql = `SELECT s.id, p.userId AS leaderId, s.category, s.title, s.introduce, s.image, s.progress, s.studyTime, s.location, s.locationDetail, s.snsNotion, s.snsEvernote, s.snsWeb
    FROM study AS s
    JOIN participate AS p
    ON p.studyId = s.id
    WHERE s.id = ? and p.leader = 1`;
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
    const noticeSql = `SELECT id, title, contents, pined, createdAt FROM notice WHERE ?`;
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
    const participateSql = `SELECT p.id, u.id as userId, u.nickname, u.image, p.leader
    FROM participate AS p
    INNER JOIN user AS u
    ON p.userId = u.id`;
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
    const applySql = `SELECT a.id, u.id as userId, u.image, a.message
      FROM apply AS a
      INNER JOIN user AS u
      ON u.id = a.userId`;
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
