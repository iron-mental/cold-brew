const express = require('express');

const asyncWrap = require('../../utils/errors/wrap');
const commonValid = require('../../middlewares/validators/common');
const commonController = require('../../controllers/common');

const router = express.Router();

// 버전 체크
router.get('/check-version', commonValid.checkVersion, asyncWrap(commonController.checkVersion));

module.exports = router;