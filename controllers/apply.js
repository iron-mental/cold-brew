const applyService = require('../services/apply');

const createApply = async (req, res) => {
  await applyService.createApply(req.params, req.body);
  return res.json({ message: '스터디 신청 완료' });
};

const applyDetail = async (req, res) => {
  const applyData = await applyService.applyDetail(req.params);
  return res.json(applyData);
};

const applyUpdate = async (req, res) => {
  await applyService.applyUpdate(req.params, req.body);
  return res.redirect(`/v1/study/${req.params.study_id}/apply/${req.params.apply_id}`, 303);
};

const applyDelete = async (req, res) => {
  await applyService.applyDelete(req.params);
  return res.json({ message: '삭제 성공' });
};

module.exports = {
  createApply,
  applyDetail,
  applyUpdate,
  applyDelete,
};
