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

// Chat
router.get('/:study_id/chat', studyValid.getChatting, asyncWrap(studyController.getChatting));

router.get('/search', studyValid.search, asyncWrap(studyController.search));
router.get('/ranking', asyncWrap(studyController.ranking));
router.get('/category', asyncWrap(studyController.category));

router.post('/', imageUpload, studyValid.createStudy, asyncWrap(studyController.createStudy));
router.get('/:study_id', studyValid.getStudy, asyncWrap(studyController.getStudy));
router.put('/:study_id', imageUpload, studyValid.studyUpdate, asyncWrap(studyController.studyUpdate));
router.delete('/:study_id', studyValid.studyDelete, asyncWrap(studyController.studyDelete));

router.put('/:study_id/delegate', studyValid.delegate, asyncWrap(studyController.delegate));
router.post('/:study_id/leave', studyValid.leaveStudy, asyncWrap(studyController.leaveStudy));

// StudyList;
router.get('/', studyValid.getStudyList, asyncWrap(studyController.getStudyList));
router.get('/paging/list', studyValid.studyPaging, asyncWrap(studyController.studyPaging));

// Notice;
router.post('/:study_id/notice', noticeValid.createNotice, asyncWrap(noticeController.createNotice));
router.get('/:study_id/notice/:notice_id', noticeValid.noticeDetail, asyncWrap(noticeController.noticeDetail));
router.put('/:study_id/notice/:notice_id', noticeValid.noticeUpdate, asyncWrap(noticeController.noticeUpdate));
router.delete('/:study_id/notice/:notice_id', noticeValid.noticeDelete, asyncWrap(noticeController.noticeDelete));

// NoticeList;
router.get('/:study_id/notice', noticeValid.noticeList, asyncWrap(noticeController.noticeList));
router.get('/:study_id/notice/paging/list', noticeValid.noticePaging, asyncWrap(noticeController.noticePaging));

// Apply(applier);
router.post('/:study_id/apply', applyValid.createApply, asyncWrap(applyController.createApply));
router.get('/:study_id/applyUser/:user_id', idCompare, applyValid.getApplyByUser, asyncWrap(applyController.getApplyByUser));
router.put('/:study_id/apply/:apply_id', applyValid.applyUpdate, asyncWrap(applyController.applyUpdate));
router.delete('/:study_id/apply/:apply_id', applyValid.applyDelete, asyncWrap(applyController.applyDelete));

// Apply(host);
router.get('/:study_id/apply/:apply_id', applyValid.getApplyById, asyncWrap(applyController.getApplyById));
router.get('/:study_id/apply', applyValid.applyListByHost, asyncWrap(applyController.applyListByHost));
router.post('/:study_id/apply/:apply_id', applyValid.applyProcess, asyncWrap(applyController.applyProcess));

module.exports = router;
