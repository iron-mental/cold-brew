const path = require('path');

const studyService = require('../services/study');

const studyPath = '/images/study';

const createStudy = async (req, res) => {
  req.body.image = path.join(studyPath, req.file.uploadedFile.basename);
  const newStudy = await studyService.createStudy(req.body, req.file.path);
  return res.redirect(`/v1/study/${newStudy.insertId}`, 303);
};

const studyDetail = async (req, res) => {
  const data = await studyService.studyDetail(req.params);
  return res.json(data);
};

const studyUpdate = async (req, res) => {
  req.body.image = path.join(studyPath, req.file.uploadedFile.basename);
  req.file._tmpPath = req.file.path;

  await studyService.studyUpdate(req.params, req.body, req.file);
  return res.redirect(`/v1/study/${req.params.studyId}`, 303);
};

module.exports = { createStudy, studyDetail, studyUpdate };
