const pool = require('./db');
const { customError } = require('../utils/errors/customError');

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
    if (err.errno === 1452) {
      throw customError(500, '조회된 유저가 없습니다');
    }
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
    const imageSQL = 'SELECT image FROM study WHERE ?';
    const [imageRows] = await conn.query(imageSQL, { id: study_id });
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
    const updateSQL = 'UPDATE study SET ? WHERE ?';
    const [updateRows] = await conn.query(updateSQL, [updateData, { id: study_id }]);
    return updateRows;
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
    const listSql = `
      SELECT
        *, count(*) members
      FROM (
        SELECT
          s.id id, s.title, s.introduce, s.image, s.sigungu, u.image leader_image,
          DATE_FORMAT(s.created_at, '%Y-%c-%d %H:%i:%s') created_at
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
    const [listRows] = await conn.query(listSql, { category });
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
    const listSql = `
      SELECT
        *, count(*) members
      FROM (
        SELECT
          s.id id, s.title, s.introduce, s.image, s.sigungu, u.image leader_image,
          DATE_FORMAT(s.created_at, '%Y-%c-%d %H:%i:%s') created_at,
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
    const [listRows] = await conn.query(listSql, [latitude, longitude, latitude, { category }]);
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
    const listSql = `
    SELECT
        *, count(*) members
      FROM (
        SELECT
          s.id, s.title, s.introduce, s.image, s.sigungu, u.image leader_image,
          DATE_FORMAT(s.created_at, '%Y-%c-%d %H:%i:%s') created_at
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
    const [listRows] = await conn.query(listSql, params);
    return listRows;
  } catch (err) {
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
  getMyStudy,
  getStudyListByNew,
  getStudyListByLength,
  studyPaging,
};
