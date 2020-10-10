const pool = require('./db');

const createApply = async createData => {
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

const applyDetail = async (studyId, applyId) => {
  try {
    const conn = await pool.getConnection();
    const detailSQL = 'SELECT * FROM apply WHERE studyId = ? and id = ?';
    const [detailRows] = await conn.query(detailSQL, [studyId, applyId]);
    await conn.release();
    return detailRows;
  } catch (err) {
    throw { status: 500, message: err.sqlMessage };
  }
};

const applyUpdate = async (studyId, applyId, updateData) => {
  try {
    const conn = await pool.getConnection(); 
    const updateSQL = 'UPDATE apply SET ? WHERE studyId = ? and id = ?';
    const [updateRows] = await conn.query(updateSQL, [updateData, studyId, applyId]);
    await conn.release();
    return updateRows;
  } catch (err) {
    throw {status: 500, message: err.sqlMessage };
  }
};

const applyDelete = async (studyId, applyId) =>{
  try{
    const conn = await pool.getConnection();
    const deleteSQL = 'DELETE FROM apply WHERE studyId = ? and id = ?'
    const [deleteRows] = await conn.query(deleteSQL, [studyId, applyId]);
    await conn.release();
    return deleteRows;
  }catch (err){
    throw {status: 500, message: err.sqlMessage}
  }
}

module.exports = {
  createApply,
  applyDetail,
  applyUpdate,
  applyDelete
};