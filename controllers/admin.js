const adminService = require('../services/admin');
const response = require('../utils/response');

const resetRedis = async (req, res) => {
  await adminService.resetRedis(req.user);
  response(res, 200, '레디스 초기화 완료');
};

const getRedis = async (req, res) => {
  const userData = await adminService.getRedis(req.user, req.params);
  response(res, 200, userData);
};

const deleteEmptyStudy = async (req, res) => {
  await adminService.deleteEmptyStudy(req.user);
  response(res, 200, '유저 없는 스터디 제거 완료');
};

module.exports = {
  resetRedis,
  getRedis,
  deleteEmptyStudy,
};
