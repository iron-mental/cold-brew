const pool = require('./db');
const { databaseError } = require('../utils/errors/database');

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
    throw databaseError(err);
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
    throw databaseError(err);
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
    throw databaseError(err);
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
    throw databaseError(err);
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
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const studyDelete = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const studySql = 'DELETE FROM study WHERE id = ?';
    const [studyRows] = await conn.query(studySql, study_id);

    const alertSql = 'DELETE FROM alert WHERE study_id = ?';
    await conn.query(alertSql, study_id);

    const applySql = 'DELETE FROM apply WHERE study_id = ?';
    await conn.query(applySql, study_id);

    const participateSql = 'DELETE FROM participate WHERE study_id = ?';
    await conn.query(participateSql, study_id);

    const noticeSql = 'DELETE FROM notice WHERE study_id = ?';
    await conn.query(noticeSql, study_id);

    await conn.commit();
    return studyRows;
  } catch (err) {
    console.log('err: ', err);
    await conn.rollback();
    throw databaseError(err);
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
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getStudyListByNew = async (user_id, category) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const countingSql = `
    UPDATE
      category_count
    SET
      ${category} = ${category} + 1
    WHERE
      user_id = ?`;
    await conn.query(countingSql, user_id);

    const studyListSql = `
      SELECT
        S.*, count(*) member_count, IF(user_id is not null, true, false) is_member
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
        WHERE category = ?
        ORDER BY p.leader DESC ) S
      LEFT JOIN (
        SELECT user_id, study_id
        FROM participate
        WHERE user_id = ? ) P
      ON S.id = P.study_id
      GROUP BY S.id
      ORDER BY S.id DESC`;
    const [listRows] = await conn.query(studyListSql, [category, user_id]);
    await conn.commit();

    return listRows;
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getStudyListByLength = async ({ latitude, longitude }, user_id, category) => {
  const conn = await pool.getConnection();
  try {
    const studyListSql = `
      SELECT
        S.*, count(*) member_count, IF(user_id is not null, true, false) is_member
      FROM (
        SELECT
          s.id id, s.title, s.introduce, s.image, s.sigungu, u.image leader_image,
          DATE_FORMAT(s.created_at, '%y / %c / %d') created_at,
          (6371*acos(cos(radians( ? ))*cos(radians( s.latitude ))*cos(radians( s.longitude )
          -radians( ? ))+sin(radians( ? ))*sin(radians( s.latitude )))) AS distance
        FROM
          study s
          LEFT JOIN participate p
          ON s.id = p.study_id
          LEFT JOIN user u
          ON u.id = p.user_id
        WHERE category = ?
        ORDER BY p.leader DESC ) AS S
      LEFT JOIN (
        SELECT user_id, study_id
        FROM participate
        WHERE user_id = ?) AS P
      ON S.id = P.study_id
      GROUP BY S.id
      ORDER BY S.distance
      `;
    const [listRows] = await conn.query(studyListSql, [longitude, latitude, longitude, category, user_id]);
    return listRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const studyPagingByNew = async (user_id, studyKeys) => {
  const params = [...studyKeys, ...studyKeys, user_id];
  const conn = await pool.getConnection();
  try {
    const studyListSql = `
      SELECT
        S.*, IF(P.user_id is not null, true, false) is_member
      FROM (
        SELECT
          *, count(*) member_count
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
          WHERE s.id in (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)) A
        GROUP BY id
        ORDER BY FIELD(id, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)) S
      LEFT JOIN (
        SELECT user_id, study_id
        FROM participate
        WHERE user_id = ? ) P
      ON S.id = P.study_id`;
    const [listRows] = await conn.query(studyListSql, params);
    return listRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const studyPagingByLength = async ({ latitude, longitude }, user_id, studyKeys) => {
  const params = [longitude, latitude, longitude, ...studyKeys, ...studyKeys, user_id];
  const conn = await pool.getConnection();
  try {
    const studyListSql = `
      SELECT
        S.*, IF(P.user_id is not null, true, false) is_member
      FROM (
        SELECT
          *, count(*) member_count
        FROM (
          SELECT
            s.id, s.title, s.introduce, s.image, s.sigungu, u.image leader_image,
            DATE_FORMAT(s.created_at, '%y / %c / %d') created_at,
            (6371*acos(cos(radians( ? ))*cos(radians( s.latitude ))*cos(radians( s.longitude )
            -radians( ? ))+sin(radians( ? ))*sin(radians( s.latitude )))) AS distance
          FROM
            study s
            LEFT JOIN participate p
            ON s.id = p.study_id
            LEFT JOIN user u
            ON u.id = p.user_id
          WHERE s.id in (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)) A
        GROUP BY id
        ORDER BY FIELD(id, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)) S
      LEFT JOIN (
        SELECT user_id, study_id
        FROM participate
        WHERE user_id = ? ) P
      ON S.id = P.study_id
      ORDER BY S.distance`;
    const [listRows] = await conn.query(studyListSql, params);
    return listRows;
  } catch (err) {
    throw databaseError(err);
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

    const alertSQL = 'DELETE FROM alert WHERE user_id = ? AND study_id = ?';
    const alertRows = await conn.query(participateSQL, [alertSQL, study_id]);

    await conn.commit();
    return { applyRows, participateRows, alertRows };
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
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
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const search = async (user_id, word) => {
  const conn = await pool.getConnection();
  try {
    const searchSql = `
    SELECT
      S.*, count(*) member_count, IF(user_id is not null, true, false) is_member
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
      WHERE
        s.title like ? OR s.introduce like ? OR s.sigungu like ?
      ORDER BY p.leader DESC ) AS S
    LEFT JOIN (
      SELECT user_id, study_id
      FROM participate
      WHERE user_id = ?) AS P
    ON S.id = P.study_id
    GROUP BY S.id
    ORDER BY S.id DESC
    `;
    const [searchRows] = await conn.query(searchSql, [word, word, word, user_id]);
    return searchRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getCategoryRanking = async (user_id) => {
  const conn = await pool.getConnection();
  try {
    const categorySql = `
    SELECT
      ai, android, backend, bigdata, blockchain, desktop, devops, embedded, etc, frontend, game, ios, iot, language, network, security
    FROM
      category_count
    WHERE
      user_id = ?
    `;
    const [categoryRows] = await conn.query(categorySql, user_id);
    return categoryRows;
  } catch (err) {
    throw databaseError(err);
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
  studyPagingByNew,
  studyPagingByLength,
  checkTitle,
  leaveStudy,
  delegate,
  search,
  getCategoryRanking,
};
