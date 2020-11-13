const userService = require('../services/project');
const response = require('../utils/response');

const createProject = async (req, res) => {
  req.body.user_id = req.params.id;
  await userService.createProject(req.body);
  response(res, 201, '프로젝트 작성 성공');
};

const getProjectList = async (req, res) => {
  const projects = await userService.getProjectList(req.params);
  response(res, 200, projects);
};

const updateProject = async (req, res) => {
  await userService.updateProject(req.params, req.body);
  response(res, 200, '프로젝트 수정 성공');
};

const deleteProject = async (req, res) => {
  await userService.deleteProject(req.params);
  response(res, 200, '프로젝트 삭제 성공');
};

module.exports = {
  createProject,
  getProjectList,
  updateProject,
  deleteProject,
};
