const pool = require('./db');

const createApply = async (createData) => {
  try {
    var conn = await pool.getConnection();
    const createSQL = 'INSERT INTO apply SET ?';
    const [createRows] = await conn.query(createSQL, createData);
    return createRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  } finally {
    await conn.release();
  }
};

const applyDetail = async (study_id, apply_id) => {
  try {
    var conn = await pool.getConnection();
    const detailSQL = `
    SELECT id, user_id, study_id, message, rejected_status,
    FROM_UNIXTIME(UNIX_TIMESTAMP(created_at),'%Y-%m-%d %H:%i:%s') AS created_at,
    FROM_UNIXTIME(UNIX_TIMESTAMP(rejected_at),'%Y-%m-%d %H:%i:%s') AS rejected_at
    FROM apply
    WHERE study_id = ? AND id = ?`;
    const [detailRows] = await conn.query(detailSQL, [study_id, apply_id]);
    return detailRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  } finally {
    await conn.release();
  }
};

const applyUpdate = async (study_id, apply_id, updateData) => {
  try {
    var conn = await pool.getConnection();
    const updateSQL = 'UPDATE apply SET ? WHERE study_id = ? AND id = ?';
    const [updateRows] = await conn.query(updateSQL, [updateData, study_id, apply_id]);
    return updateRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  } finally {
    await conn.release();
  }
};

const applyDelete = async (study_id, apply_id) => {
  try {
    var conn = await pool.getConnection();
    const deleteSQL = 'DELETE FROM apply WHERE study_id = ? AND id = ?';
    const [deleteRows] = await conn.query(deleteSQL, [study_id, apply_id]);
    return deleteRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
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
