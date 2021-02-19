const pool = require('../configs/mysql');
const { databaseError } = require('../utils/errors/database');

const createProject = async (data) => {
  const conn = await pool.getConnection();
  try {
    const createSql = `INSERT INTO project SET ?`;
    const [createRows] = await conn.query(createSql, data);
    return createRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const updateProject = async (project) => {
  const conn = await pool.getConnection();
  try {
    const updateSQL = `UPDATE project SET ? WHERE id = ?`;
    const [updateRows] = await conn.query(updateSQL, [project, project.id]);
    return updateRows;
  } catch (err) {
    throw databaseError(err);
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
    throw databaseError(err);
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
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

module.exports = {
  createProject,
  updateProject,
  getProjectList,
  deleteProject,
};
