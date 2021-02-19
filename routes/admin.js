const express = require('express');

const { checkAdmin } = require('../middlewares/auth');
const asyncWrap = require('../utils/errors/wrap');
const adminValid = require('../middlewares/validators/admin');
const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/redis/reset', checkAdmin, asyncWrap(adminController.resetRedis)); // redis데이터 리셋
router.get('/redis/user/:user_id', checkAdmin, adminValid.getRedis, asyncWrap(adminController.getRedis)); // redis데이터 조회

router.delete('/study/empty', checkAdmin, asyncWrap(adminController.deleteEmptyStudy)); // 빈 스터디 삭제

router.post('/version', checkAdmin, adminValid.setVersion, asyncWrap(adminController.setVersion)); // 버전 설정

module.exports = router;
