const path = require('path');

const studyService = require('../services/study');
const response = require('../utils/response');

const STUDY_PATH = '/images/study';

const createStudy = async (req, res) => {
  req.body.image = path.join(STUDY_PATH, req.file.uploadedFile.basename);
  await studyService.createStudy(req.body, req.file.path);
  response(res, '스터디 생성 완료', 201);
};

const studyDetail = async (req, res) => {
  const data = await studyService.studyDetail(req.params);
  return res.status(200).json(data);
};

const studyUpdate = async (req, res) => {
  if (req.file) {
    req.body.image = path.join(STUDY_PATH, req.file.uploadedFile.basename);
  }
  await studyService.studyUpdate(req.params, req.body, req.file);
  response(res, '스터디 수정 완료', 200);
};

const myStudy = async (req, res) => {
  const data = await studyService.myStudy(req.params);
  return res.status(200).json(data);
};

const studyList = async (req, res) => {
  const data = await studyService.studyList(req.params);
  return res.status(200).json(data);
};
module.exports = { createStudy, studyDetail, studyUpdate, myStudy, studyList };
