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
  const conn = await pool.getConnection();
  try {
    const studySql = `
      SELECT s.id, s.category, s.title ,s.introduce, s.image, s.progress, s.study_time, s.location, s.location_detail, s.sns_notion, s.sns_evernote, s.sns_web,
      n.id AS N_id, n.title AS N_title, n.contents AS N_contents, n.pined AS N_pined,
      FROM_UNIXTIME(UNIX_TIMESTAMP(n.created_at), '%Y-%m-%d %H:%i:%s') AS N_created_at,
      FROM_UNIXTIME(UNIX_TIMESTAMP(n.updated_at), '%Y-%m-%d %H:%i:%s') AS N_updated_at,
      p.id AS P_id, p.user_id AS P_user_id, u.nickname AS P_nickname, u.image AS P_image, p.leader AS P_leader
      FROM study AS s
      LEFT JOIN notice AS n
      ON s.id = n.study_id
      LEFT JOIN participate AS p
      ON s.id = p.study_id
      LEFT JOIN user AS u
      ON u.id = p.user_id
      WHERE s.id = ?`;
    const [studyRows] = await conn.query(studySql, study_id);
    return studyRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  } finally {
    await conn.release();
  }
};

const getApplyList = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    const applySql = `
      SELECT a.id, u.id AS user_id, u.image, a.message
      FROM apply AS a
      INNER JOIN user AS u
      ON u.id = a.user_id
      WHERE a.study_id = ?`;
    const [apply] = await conn.query(applySql, study_id);
    return apply;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
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
    throw { status: 500, message: err.sqlMessage };
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
    throw { status: 500, message: err.sqlMessage };
  } finally {
    await conn.release();
  }
};

const getMyStudy = async (id) => {
  const conn = await pool.getConnection();
  try {
    const myStudySql = `
      SELECT s.id, s.title, s.location, s.image
      FROM participate AS p
      INNER JOIN study AS s
      ON p.study_id = s.id
      WHERE p.user_id = ?`;
    const [myStudyRows] = await conn.query(myStudySql, id);
    return myStudyRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  } finally {
    await conn.release();
  }
};

const getStudyListByNew = async (category) => {
  const conn = await pool.getConnection();
  try {
    const listSql = `
      SELECT *, count(*) AS members
      FROM (SELECT s.id AS id, s.title, s.introduce, s.image, s.location, u.image AS leader_image,
      FROM_UNIXTIME(UNIX_TIMESTAMP(s.created_at), '%m-%d %H:%m:%s') AS created_at
      FROM study AS s
      LEFT JOIN participate AS p
      ON s.id = p.study_id
      LEFT JOIN user AS u
      ON u.id = p.user_id
      WHERE ?
      ORDER BY p.leader DESC) AS T
      GROUP BY id
      ORDER BY created_at DESC
      `;
    const [listRows] = await conn.query(listSql, { category });
    return listRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  } finally {
    await conn.release();
  }
};

// 이번 주 회의때 location 논의 후 쿼리 구현 예정
// const getStudyListByLength = async (category) => {
//   const conn = await pool.getConnection();
//   try {
//     const listSql = `
//       SELECT *, count(*) AS members
//       FROM (SELECT s.id AS id, s.title, s.introduce, s.image, s.location, u.image AS leader_image,
//       FROM_UNIXTIME(UNIX_TIMESTAMP(s.created_at), '%m-%d %H:%m:%s') AS created_at
//       FROM study AS s
//       LEFT JOIN participate AS p
//       ON s.id = p.study_id
//       LEFT JOIN user AS u
//       ON u.id = p.user_id
//       WHERE ?
//       ORDER BY p.leader DESC) AS T
//       GROUP BY id
//       ORDER BY created_at DESC
//       `;
//     const [listRows] = await conn.query(listSql, { category });
//     return listRows;
//   } catch (err) {
//     throw { status: 500, message: err.sqlMessage };
//   } finally {
//     await conn.release();
//   }
// };

module.exports = {
  createStudy,
  getStudy,
  getApplyList,
  getImage,
  studyUpdate,
  getMyStudy,
  getStudyListByNew,
  // getStudyListByLength,
};
