const projectDao = require('../dao/project');
const { customError } = require('../utils/errors/customError');

// 프로젝트 작성
const createProject = async (createData) => {
  // jwt 도입시 적용
  // const projectRows = await projectDao.getProjectList(req.user.user_id);
  // if (projectRows.length >= 3) {
  //   throw customError(400, '프로젝트는 3개까지 등록할 수 있습니다.');
  // }
  const createRows = await projectDao.createProject(createData);
  if (createRows.length === 0) {
    throw customError(400, '프로젝트 작성에 실패했습니다');
  }
};

const updateProject = async ({ id, project_id }, updateData) => {
  const updateRows = await projectDao.updateProject(id, project_id, updateData);
  if (updateRows.affectedRows === 0) {
    throw customError(400, '프로젝트 작성에 실패했습니다');
  }
};

// 프로젝트 목록 조회
const getProjectList = async ({ id }) => {
  const projectRows = await projectDao.getProjectList(id);
  return projectRows;
};

// 프로젝트 삭제
const deleteProject = async ({ id, project_id }) => {
  const deleteRows = await projectDao.deleteProject(id, project_id);
  if (deleteRows.affectedRows === 0) {
    throw customError(404, '조회된 프로젝트가 없습니다');
  }
};

module.exports = {
  createProject,
  getProjectList,
  updateProject,
  deleteProject,
};
