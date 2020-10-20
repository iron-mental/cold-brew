const path = require('path');

const studyService = require('../services/study');

const STUDY_PATH = '/images/study';

const createStudy = async (req, res) => {
  req.body.image = path.join(STUDY_PATH, req.file.uploadedFile.basename);
  await studyService.createStudy(req.body, req.file.path);
  return res.status(201).json({ message: '스터디 생성 성공' });
};

const studyDetail = async (req, res) => {
  const data = await studyService.studyDetail(req.params);
  return res.status(200).json(data);
};

const studyUpdate = async (req, res) => {
  if (req.file) {
    req.body.image = path.join(STUDY_PATH, req.file.uploadedFile.basename);
    await studyService.studyUpdate(req.params, req.body, req.file);
  } else {
    await studyService.studyUpdate(req.params, req.body);
  }
  return res.redirect(303, `/v1/study/${req.params.study_id}`);
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
