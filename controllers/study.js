const studyService = require('../services/study');
const path = require('path');

const createStudy = async (req, res) => {
  req.body.image = path.normalize(path.join('/images/study', req.file.originalname));
  await studyService.createStudy(req.body);
  return res.status(201).json({ message: '스터디 생성 성공' });
};

const studyDetail = async (req, res) => {
  const data = await studyService.studyDetail(req.params);
  return res.json(data);
};

module.exports = { createStudy, studyDetail };
