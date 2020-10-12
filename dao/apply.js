const pool = require('./db');

const createApply = async (createData) => {
  try {
    const conn = await pool.getConnection();
    const createSQL = 'INSERT INTO apply SET ?';
    const [createRows] = await conn.query(createSQL, createData);
    await conn.release();
    return createRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  }
};

const applyDetail = async (study_id, apply_id) => {
  try {
    const conn = await pool.getConnection();
    const detailSQL = 'SELECT * FROM apply WHERE study_id = ? and id = ?';
    const [detailRows] = await conn.query(detailSQL, [study_id, apply_id]);
    await conn.release();
    return detailRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  }
};

const applyUpdate = async (study_id, apply_id, updateData) => {
  try {
    const conn = await pool.getConnection();
    const updateSQL = 'UPDATE apply SET ? WHERE study_id = ? and id = ?';
    const [updateRows] = await conn.query(updateSQL, [updateData, study_id, apply_id]);
    await conn.release();
    return updateRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  }
};

const applyDelete = async (study_id, apply_id) => {
  try {
    const conn = await pool.getConnection();
    const deleteSQL = 'DELETE FROM apply WHERE study_id = ? and id = ?';
    const [deleteRows] = await conn.query(deleteSQL, [study_id, apply_id]);
    await conn.release();
    return deleteRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  }
};

module.exports = {
  createApply,
  applyDetail,
  applyUpdate,
  applyDelete,
};
