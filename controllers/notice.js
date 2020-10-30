const noticeService = require('../services/notice');
const response = require('../utils/response');

const createNotice = async (req, res) => {
  await noticeService.createNotice(req.params, req.body);
  response(res, '공지사항 작성 완료', 201);
};

const noticeDetail = async (req, res) => {
  const noticeData = await noticeService.noticeDetail(req.params);
  return res.status(200).json(noticeData);
};

const noticeUpdate = async (req, res) => {
  await noticeService.noticeUpdate(req.params, req.body);
  response(res, '공지사항 수정 완료', 200);
};

const noticeDelete = async (req, res) => {
  await noticeService.noticeDelete(req.params);
  response(res, '공지사항 삭제 완료', 200);
};

module.exports = {
  createNotice,
  noticeDetail,
  noticeUpdate,
  noticeDelete,
};
