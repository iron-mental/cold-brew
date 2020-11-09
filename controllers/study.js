const studyService = require('../services/study');
const response = require('../utils/response');

const createStudy = async (req, res) => {
  await studyService.createStudy(req.body);
  response(res, 201, '스터디 생성 완료');
};

const studyDetail = async (req, res) => {
  const studyData = await studyService.studyDetail(req.params);
  response(res, 200, studyData);
};

const studyUpdate = async (req, res) => {
  await studyService.studyUpdate(req.params, req.body, req.file);
  response(res, 200, '스터디 수정 완료');
};

const myStudy = async (req, res) => {
  const studyList = await studyService.myStudy(req.params);
  response(res, 200, studyList);
};

const studyList = async (req, res) => {
  const studyList = await studyService.studyList(req.query);
  response(res, 200, studyList);
};
module.exports = { createStudy, studyDetail, studyUpdate, myStudy, studyList };
