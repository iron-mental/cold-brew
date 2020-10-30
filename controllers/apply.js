const applyService = require('../services/apply');

const createApply = async (req, res) => {
  await applyService.createApply(req.params, req.body);
  return res.status(200).json({ message: '스터디 신청 완료' });
};

const applyDetail = async (req, res) => {
  const applyData = await applyService.applyDetail(req.params);
  return res.status(200).json(applyData);
};

const applyUpdate = async (req, res) => {
  await applyService.applyUpdate(req.params, req.body);
  return res.redirect(303, `/v1/study/${req.params.study_id}/apply/${req.params.apply_id}`);
};

const applyDelete = async (req, res) => {
  await applyService.applyDelete(req.params);
  return res.status(200).json({ message: '삭제 성공' });
};

module.exports = {
  createApply,
  applyDetail,
  applyUpdate,
  applyDelete,
};
