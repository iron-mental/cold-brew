const express = require('express');
const router = express.Router();

const asyncWrap = require('../../utils/errors/wrap');
const noticeValid = require('../../utils/validators/notice');
const noticeController = require('../../controllers/notice');

router.post('/:studyId/notice', noticeValid.createNotice, asyncWrap(noticeController.createNotice)); // 공지 생성 (권한확인 추가할것)
router.get('/:studyId/notice/:noticeId', noticeValid.noticeDetail, asyncWrap(noticeController.noticeDetail)); // 공지 조회

module.exports = router;
