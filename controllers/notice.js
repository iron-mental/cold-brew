const noticeService = require('../services/notice');

const createNotice = async (req, res) => {
  await noticeService.createNotice(req.params, req.body);
  return res.json({ message: '작성 완료' });
};

const noticeDetail = async (req, res) => {
  const noticeData = await noticeService.noticeDetail(req.params, req.body);
  return res.json(noticeData);
};

module.exports = {
  createNotice,
  noticeDetail,
};
