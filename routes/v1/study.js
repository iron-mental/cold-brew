const express = require('express');

const router = express.Router();

const { imageUpload } = require('../../utils/file');
const asyncWrap = require('../../utils/errors/wrap');
const studyValid = require('../../utils/validators/study');
const studyController = require('../../controllers/study');
const noticeValid = require('../../utils/validators/notice');
const noticeController = require('../../controllers/notice');
const applyValid = require('../../utils/validators/apply');
const applyController = require('../../controllers/apply');

// Study
router.post('/', imageUpload, studyValid.createStudy, asyncWrap(studyController.createStudy)); // 스터디 추가
router.get('/:study_id', studyValid.studyDetail, asyncWrap(studyController.studyDetail)); // 상세조회
router.patch('/:study_id', imageUpload, studyValid.studyUpdate, asyncWrap(studyController.studyUpdate)); // 수정

// StudyList
router.get('/:category/:sort', studyValid.studyList, asyncWrap(studyController.studyList)); // 스터디 목록 조회

// Notice
router.post('/:study_id/notice', noticeValid.createNotice, asyncWrap(noticeController.createNotice)); // 공지 생성 (권한확인 추가할것)
router.get('/:study_id/notice/:notice_id', noticeValid.noticeDetail, asyncWrap(noticeController.noticeDetail)); // 공지 조회
router.patch('/:study_id/notice/:notice_id', noticeValid.noticeUpdate, asyncWrap(noticeController.noticeUpdate)); // 공지 수정 (권한확인 추가할것)
router.delete('/:study_id/notice/:notice_id', noticeValid.noticeDelete, asyncWrap(noticeController.noticeDelete)); // 공지 삭제  (권한확인 추가할것)

// Apply
router.post('/:study_id/apply', applyValid.createApply, asyncWrap(applyController.createApply)); // 스터디 신청
router.get('/:study_id/apply/:apply_id', applyValid.applyDetail, asyncWrap(applyController.applyDetail)); // 신청 조회
router.patch('/:study_id/apply/:apply_id', applyValid.applyUpdate, asyncWrap(applyController.applyUpdate)); // 신청 수정 (reject 권한확인 추가할것)
router.delete('/:study_id/apply/:apply_id', applyValid.applyDelete, asyncWrap(applyController.applyDelete)); // 신청 삭제  (정책에 따라 없어질수도 있음)

module.exports = router;
