const pool = require('./db');
const { customError } = require('../utils/errors/customError');

const createStudy = async (user_id, createData) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const createSql = 'INSERT INTO study SET ?'; // study insert
    const [createRows] = await conn.query(createSql, createData);
    const { insertId } = createRows;

    const participateSql = 'INSERT INTO participate SET ?'; // participate insert
    const participateData = { user_id, study_id: insertId, leader: true };
    await conn.query(participateSql, participateData);

    await conn.commit();
    return createRows;
  } catch (err) {
    await conn.rollback();
    if (err.errno === 1452) {
      throw customError(500, '조회된 유저가 없습니다');
    }
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const checkTitle = async (title) => {
  const conn = await pool.getConnection();
  try {
    const checkSql = 'SELECT id FROM study WHERE ?';
    const [checkRows] = await conn.query(checkSql, { title });
    return checkRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const getStudy = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    const studySql = `
      SELECT
        s.id, s.category, s.title ,s.introduce, s.image, s.progress, s.study_time, s.sns_notion, s.sns_evernote, s.sns_web,
        s.latitude Llatitude, s.longitude Llongitude, s.address_name Laddress_name, s.place_name Lplace_name, s.location_detail Llocation_detail,
        p.id Pid, p.user_id Puser_id, u.nickname Pnickname, u.image Pimage, p.leader Pleader
      FROM
        study s
        LEFT JOIN participate p
        ON s.id = p.study_id
        LEFT JOIN user u
        ON u.id = p.user_id
      WHERE s.id = ?`;
    const [studyRows] = await conn.query(studySql, study_id);
    return studyRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const getImage = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    const imageSql = 'SELECT image FROM study WHERE ?';
    const [imageRows] = await conn.query(imageSql, { id: study_id });
    return imageRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const studyUpdate = async (study_id, updateData) => {
  const conn = await pool.getConnection();
  try {
    const updateSql = 'UPDATE study SET ? WHERE ?';
    const [updateRows] = await conn.query(updateSql, [updateData, { id: study_id }]);
    return updateRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const studyDelete = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    const studySql = 'DELETE FROM study WHERE id = ?';
    const [studyRows] = await conn.query(studySql, study_id);
    return studyRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const getMyStudy = async (id) => {
  const conn = await pool.getConnection();
  try {
    const myStudySql = `
      SELECT
        s.id, s.title, s.sigungu, s.image
      FROM
        participate p
        INNER JOIN study s
        ON p.study_id = s.id
      WHERE p.user_id = ?
      ORDER BY id DESC`;
    const [myStudyRows] = await conn.query(myStudySql, id);
    return myStudyRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const getStudyListByNew = async (category) => {
  const conn = await pool.getConnection();
  try {
    const studyListSql = `
      SELECT
        *, count(*) members
      FROM (
        SELECT
          s.id id, s.title, s.introduce, s.image, s.sigungu, u.image leader_image,
          DATE_FORMAT(s.created_at, '%y / %c / %d') created_at
        FROM
          study s
          LEFT JOIN participate p
          ON s.id = p.study_id
          LEFT JOIN user u
          ON u.id = p.user_id
        WHERE ?
        ORDER BY p.leader DESC ) T
      GROUP BY id
      ORDER BY id DESC
      `;
    const [listRows] = await conn.query(studyListSql, { category });
    return listRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const getStudyListByLength = async ({ latitude, longitude }, category) => {
  const conn = await pool.getConnection();
  try {
    const studyListSql = `
      SELECT
        *, count(*) members
      FROM (
        SELECT
          s.id id, s.title, s.introduce, s.image, s.sigungu, u.image leader_image,
          DATE_FORMAT(s.created_at, '%y / %c / %d') created_at
          (6371*acos(cos(radians(?))*cos(radians(s.latitude))*cos(radians(s.longitude)
          -radians(?))+sin(radians(?))*sin(radians(s.latitude)))) AS distance
        FROM
          study s
          LEFT JOIN participate p
          ON s.id = p.study_id
          LEFT JOIN user u
          ON u.id = p.user_id
        WHERE ?
        ORDER BY p.leader DESC ) T
      GROUP BY id
      ORDER BY distance ASC;
    `;
    const [listRows] = await conn.query(studyListSql, [latitude, longitude, latitude, { category }]);
    return listRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const studyPaging = async (studyKeys) => {
  const params = studyKeys.concat(studyKeys);
  const conn = await pool.getConnection();
  try {
    const studyListSql = `
    SELECT
        *, count(*) members
      FROM (
        SELECT
          s.id, s.title, s.introduce, s.image, s.sigungu, u.image leader_image,
          DATE_FORMAT(s.created_at, '%y / %c / %d') created_at
        FROM
          study s
          LEFT JOIN participate p
          ON s.id = p.study_id
          LEFT JOIN user u
          ON u.id = p.user_id
        WHERE s.id in (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ) T
      GROUP BY id
      ORDER BY FIELD(id, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [listRows] = await conn.query(studyListSql, params);
    return listRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const leaveStudy = async (user_id, study_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const applySql = 'DELETE FROM apply WHERE user_id = ? AND study_id = ?';
    const applyRows = await conn.query(applySql, [user_id, study_id]);

    const participateSQL = 'DELETE FROM participate WHERE user_id = ? AND study_id = ?';
    const participateRows = await conn.query(participateSQL, [user_id, study_id]);

    await conn.commit();
    return { applyRows, participateRows };
  } catch (err) {
    await conn.rollback();
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const delegate = async (study_id, old_leader, new_leader) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const updateSql = 'UPDATE participate SET leader = ? WHERE study_id = ? AND user_id = ?';
    const toLeaderRows = await conn.query(updateSql, [true, study_id, new_leader]);
    const toParticipateRows = await conn.query(updateSql, [false, study_id, old_leader]);

    await conn.commit();
    return { toLeaderRows, toParticipateRows };
  } catch (err) {
    await conn.rollback();
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

module.exports = {
  createStudy,
  getStudy,
  getImage,
  studyUpdate,
  studyDelete,
  getMyStudy,
  getStudyListByNew,
  getStudyListByLength,
  studyPaging,
  checkTitle,
  leaveStudy,
  delegate,
};
