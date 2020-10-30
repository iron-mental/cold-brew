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
      SELECT
        s.id, s.category, s.title ,s.introduce, s.image, s.progress, s.study_time, s.location, s.location_detail, s.sns_notion, s.sns_evernote, s.sns_web,
        n.id Nid, n.title Ntitle, n.contents Ncontents, n.pinned Npinned,
        DATE_FORMAT(n.created_at, "%Y-%c-%d %H:%i:%s") Ncreated_at,
        DATE_FORMAT(n.updated_at, "%Y-%c-%d %H:%i:%s") Nupdated_at,
        p.id Pid, p.user_id Puser_id, u.nickname Pnickname, u.image Pimage, p.leader Pleader
      FROM
        study s
        LEFT JOIN notice n
        ON s.id = n.study_id
        LEFT JOIN participate p
        ON s.id = p.study_id
        LEFT JOIN user u
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

const getMyStudy = async (user_id) => {
  const conn = await pool.getConnection();
  try {
    const myStudySql = `
      SELECT
        s.id, s.title, s.location, s.image
      FROM
        participate p
        INNER JOIN study s
        ON p.study_id = s.id
      WHERE p.user_id = ?
      ORDER BY id DESC`;
    const [myStudyRows] = await conn.query(myStudySql, user_id);
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
      SELECT
        *, count(*) members
      FROM (
        SELECT
          s.id, s.title, s.introduce, s.image, s.location, u.image leader_image,
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
//       SELECT *, count(*) members
//       FROM (SELECT s.id id, s.title, s.introduce, s.image, s.location, u.image leader_image,
//       DATE_FORMAT(s.created_at, '%Y-%c-%d %H:%i:%s') created_at
//       FROM study s
//       LEFT JOIN participate p
//       ON s.id = p.study_id
//       LEFT JOIN user u
//       ON u.id = p.user_id
//       WHERE ?
//       ORDER BY p.leader DESC) T
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
