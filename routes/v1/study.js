const express = require('express');

const router = express.Router();

const { imageUpload } = require('../../utils/file');
const asyncWrap = require('../../utils/errors/wrap');
const studyValid = require('../../utils/validators/study');
const noticeValid = require('../../utils/validators/notice');
const studyController = require('../../controllers/study');
const noticeController = require('../../controllers/notice');

router.post('/:study_id/notice', noticeValid.createNotice, asyncWrap(noticeController.createNotice)); // 공지 생성 (권한확인 추가할것)
router.get('/:study_id/notice/:notice_id', noticeValid.noticeDetail, asyncWrap(noticeController.noticeDetail)); // 공지 조회
router.patch('/:study_id/notice/:notice_id', noticeValid.noticeUpdate, asyncWrap(noticeController.noticeUpdate)); // 공지 수정 (권한확인 추가할것)
router.delete('/:study_id/notice/:notice_id', noticeValid.noticeDelete, asyncWrap(noticeController.noticeDelete)); // 공지 삭제  (권한확인 추가할것)

router.post('/', imageUpload, studyValid.createStudy, asyncWrap(studyController.createStudy)); // 스터디 추가

router.get('/:study_id', studyValid.studyDetail, asyncWrap(studyController.studyDetail)); // 상세조회
router.patch('/:study_id', imageUpload, studyValid.studyUpdate, asyncWrap(studyController.studyUpdate)); // 수정

module.exports = router;
