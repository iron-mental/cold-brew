const express = require('express');
const multer = require('multer');
const path = require('path');

const asyncWrap = require('../../utils/errors/wrap');
const studyValid = require('../../utils/validators/study');
const studyController = require('../../controllers/study');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../public/images/study'));
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (extension !== '.jpg' && extension !== '.jpeg') {
      console.error('Extension Error: ', extension);
      cb({ status: 422, message: 'Extension error' });
    }
    cb(null, true);
  },
}).single('image');

router.post(
  '/',
  (req, res, next) => {
    upload(req, res, err => {
      if (err) {
        next(err);
      }
      next();
    });
  },
  studyValid.createStudy,
  asyncWrap(studyController.createStudy)
); // 스터디 추가
module.exports = router;
