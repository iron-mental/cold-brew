const noticeService = require('../services/notice');

const createNotice = async (req, res) => {
  await noticeService.createNotice(req.params, req.body);
  return res.json({ message: '작성 완료' });
};

const noticeDetail = async (req, res) => {
  const noticeData = await noticeService.noticeDetail(req.params);
  return res.json(noticeData);
};

const noticeUpdate = async (req, res) => {
  await noticeService.noticeUpdate(req.params, req.body);
  return res.redirect(`/v1/study/${req.params.studyId}/notice/${req.params.noticeId}`, 303);  
};

const noticeDelete = async (req, res) => {
  await noticeService.noticeDelete(req.params);
  return res.json({ message: '삭제 성공'});
};

module.exports = {
  createNotice,
  noticeDetail,
  noticeUpdate,
  noticeDelete
};
