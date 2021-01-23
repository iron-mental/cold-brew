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

module.exports = {
  resetRedis,
  getRedis,
};
