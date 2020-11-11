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
router.get('/:study_id', studyValid.studyDetail, asyncWrap(studyController.studyDetail)); // 스터디 상세조회
router.put('/:study_id', imageUpload, studyValid.studyUpdate, asyncWrap(studyController.studyUpdate)); // 스터디 수정 (권한확인 추가할것)

// StudyList
router.get('/', studyValid.studyList, asyncWrap(studyController.studyList)); // 스터디 목록 조회
router.get('/paging/list', studyValid.studyPaging, asyncWrap(studyController.studyPaging)); // 스터디 목록 조회 paging

// Notice
router.post('/:study_id/notice', noticeValid.createNotice, asyncWrap(noticeController.createNotice)); // 공지 생성 (권한확인 추가할것)
router.get('/:study_id/notice/:notice_id', noticeValid.noticeDetail, asyncWrap(noticeController.noticeDetail)); // 공지 조회
router.put('/:study_id/notice/:notice_id', noticeValid.noticeUpdate, asyncWrap(noticeController.noticeUpdate)); // 공지 수정 (권한확인 추가할것)
router.delete('/:study_id/notice/:notice_id', noticeValid.noticeDelete, asyncWrap(noticeController.noticeDelete)); // 공지 삭제  (권한확인 추가할것)

// NoticeList
router.get('/:study_id/notice', noticeValid.noticeList, asyncWrap(noticeController.noticeList)); // 공지사항 목록 조회
router.get('/:study_id/notice/paging/list', noticeValid.noticePaging, asyncWrap(noticeController.noticePaging)); // 공지사항 목록 조회

// Apply
router.post('/:study_id/apply', applyValid.createApply, asyncWrap(applyController.createApply)); // 스터디 신청
router.get('/:study_id/apply/:apply_id', applyValid.applyDetail, asyncWrap(applyController.applyDetail)); // 신청 조회 (권한확인 추가할것)
router.put('/:study_id/apply/:apply_id', applyValid.applyUpdate, asyncWrap(applyController.applyUpdate)); // 신청 수정 (reject 권한확인 추가할것)
router.delete('/:study_id/apply/:apply_id', applyValid.applyDelete, asyncWrap(applyController.applyDelete)); // 신청 삭제  (정책에 따라 없어질수도 있음)

module.exports = router;
