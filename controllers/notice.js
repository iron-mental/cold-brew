const noticeService = require('../services/notice');
const response = require('../utils/response');

const createNotice = async (req, res) => {
  await noticeService.createNotice(req.params, req.body);
  response(res, 201, '공지사항 작성 완료');
};

const noticeDetail = async (req, res) => {
  const noticeData = await noticeService.noticeDetail(req.params);
  response(res, 200, noticeData);
};

const noticeUpdate = async (req, res) => {
  await noticeService.noticeUpdate(req.params, req.body);
  response(res, 200, '공지사항 수정 완료');
};

const noticeDelete = async (req, res) => {
  await noticeService.noticeDelete(req.params);
  response(res, 200, '공지사항 삭제 완료');
};

const noticeList = async (req, res) => {
  const noticeList = await noticeService.noticeList(req.params);
  response(res, 200, noticeList);
};

const noticePaging = async (req, res) => {
  const noticeKeys = Array.from({ length: 10 });
  for (const [key, value] of Object.entries(req.query.values.split(','))) {
    noticeKeys[key] = value;
  }

  const studyList = await noticeService.noticePaging(noticeKeys);
  response(res, 200, studyList);
};

module.exports = {
  createNotice,
  noticeDetail,
  noticeUpdate,
  noticeDelete,
  noticeList,
  noticePaging,
};
