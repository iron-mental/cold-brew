const express = require('express');

const asyncWrap = require('../../utils/errors/wrap');
const adminValid = require('../../middlewares/validators/admin');
const adminController = require('../../controllers/admin');

const router = express.Router();

router.get('/redis/reset', asyncWrap(adminController.resetRedis)); // redis데이터 리셋

module.exports = router;
