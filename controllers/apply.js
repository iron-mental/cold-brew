const applyService = require('../services/apply');
const response = require('../utils/response');

const createApply = async (req, res) => {
  await applyService.createApply(req.params, req.body);
  response(res, '가입 신청 완료', 201);
};

const applyDetail = async (req, res) => {
  const applyData = await applyService.applyDetail(req.params);
  return res.status(200).json(applyData);
};

const applyUpdate = async (req, res) => {
  await applyService.applyUpdate(req.params, req.body);
  response(res, '가입 수정 완료', 200);
};

const applyDelete = async (req, res) => {
  await applyService.applyDelete(req.params);
  response(res, '가입 삭제 완료', 200);
};

module.exports = {
  createApply,
  applyDetail,
  applyUpdate,
  applyDelete,
};
