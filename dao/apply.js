const pool = require('../configs/mysql');
const { databaseError } = require('../utils/errors/database');
const { ApplyEnum } = require('../utils/variables/enum');

const createApply = async (createData) => {
  const conn = await pool.getConnection();
  try {
    const createSql = 'INSERT INTO apply SET ?';
    const [createRows] = await conn.query(createSql, createData);
    return createRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getApplyByUser = async (study_id, user_id) => {
  const conn = await pool.getConnection();
  try {
    const detailSql = `
      SELECT
        id, message
      FROM
        apply
      WHERE
        study_id = ? AND user_id = ?`;
    const [detailRows] = await conn.query(detailSql, [study_id, user_id]);

    return detailRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getApplyById = async (study_id, apply_id) => {
  const conn = await pool.getConnection();
  try {
    const applySql = `
      SELECT
        a.id, a.user_id, a.study_id, a.message, a.apply_status,
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
    const [applyRows] = await conn.query(applySql, [study_id, apply_id]);
    return applyRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const applyCheck = async (user_id, study_id, apply_id) => {
  const conn = await pool.getConnection();
  try {
    const checkSql = `
      SELECT apply_status 
      FROM apply 
      WHERE id = ? 
        AND user_id = ? 
        AND study_id = ?`;
    const [checkRows] = await conn.query(checkSql, [apply_id, user_id, study_id]);
    return checkRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const applyUpdate = async (user_id, study_id, apply_id, updateData) => {
  const conn = await pool.getConnection();
  try {
    const updateSql = `
      UPDATE apply 
      SET ? 
      WHERE id = ? 
        AND user_id = ?
        AND study_id = ?
        AND apply_status = ?`;
    const [updateRows] = await conn.query(updateSql, [updateData, apply_id, user_id, study_id, ApplyEnum.apply]);
    return updateRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const applyDelete = async (user_id, apply_id) => {
  const conn = await pool.getConnection();
  try {
    const deleteSql = 'DELETE FROM apply WHERE id = ? AND user_id = ?';
    const [deleteRows] = await conn.query(deleteSql, [apply_id, user_id]);
    return deleteRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const applyListByHost = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    const applySql = `
      SELECT 
        a.id, u.id user_id, u.nickname, u.image, a.message
      FROM
        apply a
        INNER JOIN user u
        ON u.id = a.user_id
      WHERE a.apply_status = ? AND a.study_id = ?`;
    const [applyRows] = await conn.query(applySql, [ApplyEnum.apply, study_id]);
    return applyRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const applyListByUser = async (user_id) => {
  const conn = await pool.getConnection();
  try {
    const applySql = `
      SELECT 
        a.id, a.study_id, s.title, s.image, a.message
      FROM
        apply a
        LEFT JOIN study s
        ON a.study_id = s.id
      WHERE a.apply_status = ? AND a.user_id = ?`;
    const [applyRows] = await conn.query(applySql, [ApplyEnum.apply, user_id]);
    return applyRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const setAllow = async (study_id, apply_id, user_id) => {
  const conn = await pool.getConnection();
  try {
    const allowSql = `
      UPDATE apply 
      SET apply_status = ? 
      WHERE id = ? AND apply_status = ?`;
    const [allowRows] = await conn.query(allowSql, [ApplyEnum.allow, apply_id, ApplyEnum.apply]);

    if (allowRows.changedRows > 0) {
      const participateSql = `INSERT INTO participate SET ?`;
      await conn.query(participateSql, { study_id, user_id });
    }
    return allowRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const setReject = async (apply_id) => {
  const conn = await pool.getConnection();
  try {
    const rejectSql = `
      UPDATE apply 
      SET apply_status = ? 
      WHERE id = ? AND apply_status = ?`;
    const [rejectRows] = await conn.query(rejectSql, [ApplyEnum.reject, apply_id, ApplyEnum.apply]);

    const userSql = 'SELECT user_id FROM apply WHERE id = ?';
    const [userRows] = await conn.query(userSql, apply_id);

    return [rejectRows, userRows];
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};
module.exports = {
  createApply,
  getApplyByUser,
  getApplyById,
  applyUpdate,
  applyDelete,
  applyListByHost,
  applyListByUser,
  setAllow,
  setReject,
  applyCheck,
};
