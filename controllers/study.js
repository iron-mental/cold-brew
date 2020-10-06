const path = require('path');

const studyService = require('../services/study');

const studyPath = '/images/study';

const createStudy = async (req, res) => {
  req.body.image = path.join(studyPath, req.file.uploadedFile.basename);
  await studyService.createStudy(req.body, req.file.path);
  return res.status(201).json({ message: '스터디 생성 성공' });
};

const studyDetail = async (req, res) => {
  const data = await studyService.studyDetail(req.params);
  return res.json(data);
};

const studyUpdate = async (req, res) => {
  req.body.image = path.join(studyPath, req.file.uploadedFile.basename);

  req.file._tmpPath = req.file.path;
  await studyService.studyUpdate(req.params, req.body, req.file);
  return res.json({ message: '수정 성공' });
};
module.exports = { createStudy, studyDetail, studyUpdate };
