const express = require('express');

const router = express.Router();

const { imageUpload } = require('../../middlewares/file');
const { idCompare } = require('../../middlewares/auth');
const asyncWrap = require('../../utils/errors/wrap');
const studyValid = require('../../middlewares/validators/study');
const studyController = require('../../controllers/study');
const noticeValid = require('../../middlewares/validators/notice');
const noticeController = require('../../controllers/notice');
const applyValid = require('../../middlewares/validators/apply');
const applyController = require('../../controllers/apply');

// Study
router.get('/search', studyValid.search, asyncWrap(studyController.search)); // 검색
router.get('/ranking', asyncWrap(studyController.ranking)); // 핫 등록 키워드

router.post('/', imageUpload, studyValid.createStudy, asyncWrap(studyController.createStudy)); // 스터디 추가
router.get('/:study_id', studyValid.studyDetail, asyncWrap(studyController.studyDetail)); // 스터디 상세조회
router.put('/:study_id', imageUpload, studyValid.studyUpdate, asyncWrap(studyController.studyUpdate)); // 스터디 수정
router.delete('/:study_id', studyValid.studyDelete, asyncWrap(studyController.studyDelete)); // 스터디 수정

router.put('/:study_id/delegate', studyValid.delegate, asyncWrap(studyController.delegate)); // 방장 위임
router.post('/:study_id/leave', studyValid.leaveStudy, asyncWrap(studyController.leaveStudy)); // 스터디 탈퇴

// StudyList
router.get('/', studyValid.studyList, asyncWrap(studyController.studyList)); // 스터디 목록 조회
router.get('/paging/list', studyValid.studyPaging, asyncWrap(studyController.studyPaging)); // 스터디 목록 조회 paging

// Notice
router.post('/:study_id/notice', noticeValid.createNotice, asyncWrap(noticeController.createNotice)); // 공지 생성
router.get('/:study_id/notice/:notice_id', noticeValid.noticeDetail, asyncWrap(noticeController.noticeDetail)); // 공지 조회
router.put('/:study_id/notice/:notice_id', noticeValid.noticeUpdate, asyncWrap(noticeController.noticeUpdate)); // 공지 수정
router.delete('/:study_id/notice/:notice_id', noticeValid.noticeDelete, asyncWrap(noticeController.noticeDelete)); // 공지 삭제

// NoticeList
router.get('/:study_id/notice', noticeValid.noticeList, asyncWrap(noticeController.noticeList)); // 공지사항 목록 조회
router.get('/:study_id/notice/paging/list', noticeValid.noticePaging, asyncWrap(noticeController.noticePaging)); // 공지사항 목록 조회

// Apply (applier)
router.post('/:study_id/apply', applyValid.createApply, asyncWrap(applyController.createApply)); // 스터디 신청
router.get('/:study_id/applyUser/:user_id', idCompare, applyValid.getApplyByUser, asyncWrap(applyController.getApplyByUser)); // 신청 조회
router.put('/:study_id/apply/:apply_id', applyValid.applyUpdate, asyncWrap(applyController.applyUpdate)); // 신청 수정
router.delete('/:study_id/apply/:apply_id', applyValid.applyDelete, asyncWrap(applyController.applyDelete)); // 신청 삭제

// Apply (host)
router.get('/:study_id/apply/:apply_id', applyValid.getApplyById, asyncWrap(applyController.getApplyById)); // 신청 조회
router.get('/:study_id/apply', applyValid.applyList, asyncWrap(applyController.applyList)); // 스터디 신청 목록 조회
router.post('/:study_id/apply/:apply_id', applyValid.applyProcess, asyncWrap(applyController.applyProcess)); // 스터디 신청 처리

module.exports = router;
