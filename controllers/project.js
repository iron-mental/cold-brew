const userService = require('../services/project');
const response = require('../utils/response');

const createProject = async (req, res) => {
  req.body.user_id = req.params.id;
  await userService.createProject(req.body);
  response(res, 201, '프로젝트가 작성되었습니다');
};

const getProjectList = async (req, res) => {
  const projects = await userService.getProjectList(req.params);
  response(res, 200, projects);
};

const updateProject = async (req, res) => {
  await userService.updateProject(req.params, req.body);
  response(res, 200, '프로젝트가 수정되었습니다');
};

const deleteProject = async (req, res) => {
  await userService.deleteProject(req.params);
  response(res, 200, '프로젝트가 삭제되었습니다');
};

module.exports = {
  createProject,
  getProjectList,
  updateProject,
  deleteProject,
};
