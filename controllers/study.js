const studyService = require('../services/study');

const createStudy = async (req, res) => {
  await studyService.createStudy(req.body);
  return res.status(201).json({ message: '스터디 생성 성공' });
};

module.exports = { createStudy };
