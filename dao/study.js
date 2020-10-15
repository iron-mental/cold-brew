const pool = require('./db');

const createStudy = async (user_id, createData) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const createSQL = 'INSERT INTO study SET ?'; // study insert
    const [createRows] = await conn.query(createSQL, createData);
    const { insertId } = createRows;

    const participateSQL = 'INSERT INTO participate SET ?'; // participate insert
    const participateData = { user_id, study_id: insertId, leader: true };
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

const getStudy = async (study_id) => {
  try {
    var conn = await pool.getConnection();
    const studySql = `SELECT s.id, p.user_id AS leader_id, s.category, s.title, s.introduce, s.image, s.progress, s.study_time, s.location, s.location_detail, s.sns_notion, s.sns_evernote, s.sns_web
    FROM study AS s
    JOIN participate AS p
    ON p.study_id = s.id
    WHERE s.id = ? and p.leader = 1`;
    const [studyRows] = await conn.query(studySql, study_id);
    return studyRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  } finally {
    conn.release();
  }
};

const getNoticeList = async (study_id) => {
  try {
    var conn = await pool.getConnection();
    const noticeSql = `SELECT id, title, contents, pined, created_at FROM notice WHERE ?`;
    const [noticeRows] = await conn.query(noticeSql, { study_id });
    return noticeRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  } finally {
    conn.release();
  }
};

const getParticipateList = async (study_id) => {
  try {
    var conn = await pool.getConnection();
    const participateSql = `SELECT p.id, u.id as user_id, u.nickname, u.image, p.leader
    FROM participate AS p
    INNER JOIN user AS u
    ON p.user_id = u.id
    WHERE p.study_id = ?`;
    const [participateRows] = await conn.query(participateSql, study_id);
    return participateRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  } finally {
    conn.release();
  }
};

const getApplyList = async (study_id) => {
  try {
    var conn = await pool.getConnection();
    const applySql = `SELECT a.id, u.id as user_id, u.image, a.message
      FROM apply AS a
      INNER JOIN user AS u
      ON u.id = a.user_id
      WHERE a.study_id = ?`;
    const [apply] = await conn.query(applySql, study_id);
    return apply;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  } finally {
    conn.release();
  }
};

const getImage = async (study_id) => {
  try {
    var conn = await pool.getConnection();
    const imageSQL = 'SELECT image FROM study WHERE ?';
    const [imageRows] = await conn.query(imageSQL, { id: study_id });
    return imageRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  } finally {
    conn.release();
  }
};

const studyUpdate = async (study_id, updateData) => {
  try {
    var conn = await pool.getConnection();
    const updateSQL = 'UPDATE study SET ? WHERE ?';
    const [updateRows] = await conn.query(updateSQL, [updateData, { id: study_id }]);
    return updateRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  } finally {
    conn.release();
  }
};

module.exports = { createStudy, getStudy, getNoticeList, getApplyList, getParticipateList, getImage, studyUpdate };
