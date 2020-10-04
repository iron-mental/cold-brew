const express = require('express');
const router = express.Router();

const asyncWrap = require('../../utils/errors/wrap');
const studyValid = require('../../utils/validators/study');
const studyController = require('../../controllers/study');

router.post('/', studyValid.createStudy, asyncWrap(studyController.createStudy)); // 스터디 추가

module.exports = router;
