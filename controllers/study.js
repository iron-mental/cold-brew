const studyService = require('../services/study');
const path = require('path');

const createStudy = async (req, res) => {
  const basename = path.basename(req.file.originalname).split('.').slice(0, -1).join('.');
  const extension = path.extname(req.file.originalname).toLowerCase();
  req.body.image = path.normalize(path.join('/images/study', basename)).concat(extension);

  await studyService.createStudy(req.body);
  return res.status(201).json({ message: '스터디 생성 성공' });
};

module.exports = { createStudy };
