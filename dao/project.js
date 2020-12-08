const pool = require('./db');
const { customError } = require('../utils/errors/custom');

const createProject = async (data) => {
  const conn = await pool.getConnection();
  try {
    const createSql = `INSERT INTO project SET ?`;
    const [createRows] = await conn.query(createSql, data);
    return createRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const getProjectList = async (id) => {
  const conn = await pool.getConnection();
  try {
    const projectSql = `
      SELECT
        id, title, contents, sns_github, sns_appstore, sns_playstore,
        DATE_FORMAT(created_at, "%Y-%c-%d %H:%i:%s") create_at
      FROM project
      WHERE user_id = ?`;
    const [projectData] = await conn.query(projectSql, id);
    return projectData;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const updateProject = async (user_id, project_id, updateData) => {
  const conn = await pool.getConnection();
  try {
    const updateSQL = 'UPDATE project SET ? WHERE user_id = ? AND id = ?';
    const [updateRows] = await conn.query(updateSQL, [updateData, user_id, project_id]);
    return updateRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

const deleteProject = async (user_id, project_id) => {
  const conn = await pool.getConnection();
  try {
    const deleteSQL = 'DELETE FROM project WHERE user_id = ? AND id = ?';
    const [deleteRows] = await conn.query(deleteSQL, [user_id, project_id]);
    return deleteRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

module.exports = {
  createProject,
  getProjectList,
  updateProject,
  deleteProject,
};
