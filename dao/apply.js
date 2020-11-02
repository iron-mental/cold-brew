const pool = require('./db');
const { customError } = require('../utils/errors/customError');

const createApply = async (createData) => {
  const conn = await pool.getConnection();
  try {
    const createSQL = 'INSERT INTO apply SET ?';
    const [createRows] = await conn.query(createSQL, createData);
    return createRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const applyDetail = async (study_id, apply_id) => {
  const conn = await pool.getConnection();
  try {
    const detailSQL = `
    SELECT
      a.id, a.user_id, a.study_id, a.message, a.rejected_status,
      DATE_FORMAT(a.created_at, "%Y-%c-%d %H:%i:%s") created_at,
      DATE_FORMAT(a.rejected_at, "%Y-%c-%d %H:%i:%s") rejected_at,
      u.image, u.nickname, u.sns_github, u.sns_linkedin, u.sns_web,
      p.id Pid, p.title Ptitle, p.contents Pcontents, p.sns_github Psns_github, p.sns_appstore Psns_appstore, p.sns_playstore Psns_playstore
    FROM
      apply a
      LEFT JOIN user u
        ON u.id = a.user_id
      LEFT JOIN project p
        ON u.id = p.user_id
    WHERE
      a.study_id = ? AND a.id = ?`;
    const [detailRows] = await conn.query(detailSQL, [study_id, apply_id]);
    return detailRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const applyUpdate = async (study_id, apply_id, updateData) => {
  const conn = await pool.getConnection();
  try {
    const updateSQL = 'UPDATE apply SET ? WHERE study_id = ? AND id = ?';
    const [updateRows] = await conn.query(updateSQL, [updateData, study_id, apply_id]);
    return updateRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const applyDelete = async (study_id, apply_id) => {
  const conn = await pool.getConnection();
  try {
    const deleteSQL = 'DELETE FROM apply WHERE study_id = ? AND id = ?';
    const [deleteRows] = await conn.query(deleteSQL, [study_id, apply_id]);
    return deleteRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

module.exports = {
  createApply,
  applyDetail,
  applyUpdate,
  applyDelete,
};
