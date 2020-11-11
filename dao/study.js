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

const getApplyList = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    const applySql = `
      SELECT 
        a.id, u.id user_id, u.image, a.message
      FROM
        apply a
        INNER JOIN user u
        ON u.id = a.user_id
      WHERE a.study_id = ?`;
    const [apply] = await conn.query(applySql, study_id);
    return apply;
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
        s.id, s.title, s.region_2depth_name, s.image
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
          s.id id, s.title, s.introduce, s.image, s.region_2depth_name, u.image leader_image,
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

const getStudyListByLength = async (category) => {
  const user_id = 1;
  const conn = await pool.getConnection();
  try {
    const listSql = `
      SELECT
        @lat:= latitude latitude,
        @long:= longitude longitude,
        @2depth:= region_2depth_name region_2depth_name
      FROM user
      WHERE id = ?;

      SELECT
        *, count(*) members
      FROM (
        SELECT
          s.id id, s.title, s.introduce, s.image, s.region_2depth_name, u.image leader_image,
          DATE_FORMAT(s.created_at, '%Y-%c-%d %H:%i:%s') created_at,
          (6371*acos(cos(radians(@lat))*cos(radians(s.latitude))*cos(radians(s.longitude)
          -radians(@long))+sin(radians(@lat))*sin(radians(s.latitude)))) AS distance
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
    const [listRows] = await conn.query(listSql, [user_id, { category }]);
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
          s.id, s.title, s.introduce, s.image, s.region_2depth_name, u.image leader_image,
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
  getApplyList,
  getImage,
  studyUpdate,
  getMyStudy,
  getStudyListByNew,
  getStudyListByLength,
  studyPaging,
};
