const express = require('express');
const multer = require('multer');
const path = require('path');

const asyncWrap = require('../../utils/errors/wrap');
const studyValid = require('../../utils/validators/study');
const studyController = require('../../controllers/study');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../../public/images/study'));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

router.post('/', upload.single('image'), studyValid.createStudy, asyncWrap(studyController.createStudy)); // 스터디 추가
module.exports = router;
