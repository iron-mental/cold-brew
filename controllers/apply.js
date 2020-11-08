const applyService = require('../services/apply');
const response = require('../utils/response');

const createApply = async (req, res) => {
  await applyService.createApply(req.params, req.body);
  response(res, 201, '가입신청 완료');
};

const applyDetail = async (req, res) => {
  const applyData = await applyService.applyDetail(req.params);
  response(res, 200, applyData);
};

const applyUpdate = async (req, res) => {
  await applyService.applyUpdate(req.params, req.body);
  response(res, 200, '가입신청 수정 완료');
};

const applyDelete = async (req, res) => {
  await applyService.applyDelete(req.params);
  response(res, 200, '가입신청 삭제 완료');
};

module.exports = {
  createApply,
  applyDetail,
  applyUpdate,
  applyDelete,
};
