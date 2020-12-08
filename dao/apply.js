const pool = require('./db');
const { customError } = require('../utils/errors/custom');
const { applyEnum } = require('../utils/variables/enums');

const createApply = async (createData) => {
  const conn = await pool.getConnection();
  try {
    const createSql = 'INSERT INTO apply SET ?';
    const [createRows] = await conn.query(createSql, createData);
    return createRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const getApplyByUser = async (study_id, user_id) => {
  const conn = await pool.getConnection();
  try {
    const detailSql = `
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
      a.study_id = ? AND a.user_id = ?`;
    const [detailRows] = await conn.query(detailSql, [study_id, user_id]);

    return detailRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const getApplyById = async (study_id, apply_id) => {
  const conn = await pool.getConnection();
  try {
    const detailSql = `
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
    const [detailRows] = await conn.query(detailSql, [study_id, apply_id]);
    return detailRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const applyUpdate = async (user_id, apply_id, updateData) => {
  const conn = await pool.getConnection();
  try {
    const updateSql = 'UPDATE apply SET ? WHERE id = ? AND user_id = ?';
    const [updateRows] = await conn.query(updateSql, [updateData, apply_id, user_id]);
    return updateRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
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
      WHERE a.apply_status = ? AND a.study_id = ?`;
    const [applyRows] = await conn.query(applySql, [applyEnum.apply, study_id]);
    return applyRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const setAllow = async (study_id, apply_id, user_id) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const allowSql = `UPDATE apply SET apply_status = ? WHERE id = ?`;
    await conn.query(allowSql, [applyEnum.allow, apply_id]);

    const createdSql = `INSERT INTO participate SET ?`;
    const [allowRows] = await conn.query(createdSql, { study_id, user_id });
    await conn.commit();
    return allowRows;
  } catch (err) {
    await conn.rollback();
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const setReject = async (apply_id) => {
  const conn = await pool.getConnection();
  try {
    const rejectSql = 'UPDATE apply SET apply_status = ? WHERE id = ?';
    const [apply] = await conn.query(rejectSql, [applyEnum.reject, apply_id]);
    return apply;
  } catch (err) {
    throw customError(500, err.sqlMessage);
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
  getApplyList,
  setAllow,
  setReject,
};
