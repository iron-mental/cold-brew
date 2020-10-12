const express = require('express');
const router = express.Router();

const asyncWrap = require('../../utils/errors/wrap');
const applyValid = require('../../utils/validators/apply');
const applyController = require('../../controllers/apply');

router.post('/:studyId/apply', applyValid.createApply, asyncWrap(applyController.createApply)); // 스터디 신청
router.get('/:studyId/apply/:applyId', applyValid.applyDetail, asyncWrap(applyController.applyDetail)); // 신청 조회
router.patch('/:studyId/apply/:applyId', applyValid.applyUpdate, asyncWrap(applyController.applyUpdate)); // 신청 수정 (reject 권한확인 추가할것)
router.delete('/:studyId/apply/:applyId', applyValid.applyDelete, asyncWrap(applyController.applyDelete)); // 신청 삭제  (정책에 따라 없어질수도 있음)

module.exports = router;
