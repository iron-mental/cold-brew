const express = require('express');

const { imageUpload } = require('../../utils/file');
const asyncWrap = require('../../utils/errors/wrap');
const studyValid = require('../../utils/validators/study');
const studyController = require('../../controllers/study');

const router = express.Router();

router.post('/', imageUpload, studyValid.createStudy, asyncWrap(studyController.createStudy)); // 스터디 추가

router.get('/:study_id', studyValid.studyDetail, asyncWrap(studyController.studyDetail)); // 상세조회
router.patch('/:study_id', imageUpload, studyValid.studyUpdate, asyncWrap(studyController.studyUpdate)); // 수정

module.exports = router;
