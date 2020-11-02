const path = require('path');

const studyService = require('../services/study');
const response = require('../utils/response');

const STUDY_PATH = '/images/study';

const createStudy = async (req, res) => {
  if (req.file) {
    req.body.image = path.join(STUDY_PATH, req.file.uploadedFile.basename);
  }
  await studyService.createStudy(req.body, req.file.path);
  response(res, 201, '스터디 생성 완료');
};

const studyDetail = async (req, res) => {
  const studyData = await studyService.studyDetail(req.params);
  response(res, 200, studyData);
};

const studyUpdate = async (req, res) => {
  if (req.file) {
    req.body.image = path.join(STUDY_PATH, req.file.uploadedFile.basename);
  }
  await studyService.studyUpdate(req.params, req.body, req.file);
  response(res, 200, '스터디 수정 완료');
};

const myStudy = async (req, res) => {
  const studyList = await studyService.myStudy(req.params);
  response(res, 200, studyList);
};

const studyList = async (req, res) => {
  const studyList = await studyService.studyList(req.params);
  response(res, 200, studyList);
};
module.exports = { createStudy, studyDetail, studyUpdate, myStudy, studyList };
