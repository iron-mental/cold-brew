const noticeService = require('../services/notice');

const createNotice = async (req, res) => {
  await noticeService.createNotice(req.params, req.body);
  return res.status(201).json({ message: '작성 완료' });
};

const noticeDetail = async (req, res) => {
  const noticeData = await noticeService.noticeDetail(req.params);
  return res.status(200).json(noticeData);
};

const noticeUpdate = async (req, res) => {
  await noticeService.noticeUpdate(req.params, req.body);
  return res.redirect(303, `/v1/study/${req.params.study_id}/notice/${req.params.notice_id}`);
};

const noticeDelete = async (req, res) => {
  await noticeService.noticeDelete(req.params);
  return res.status(200).json({ message: '삭제 성공' });
};

module.exports = {
  createNotice,
  noticeDetail,
  noticeUpdate,
  noticeDelete,
};
