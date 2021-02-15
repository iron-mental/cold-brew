const express = require('express');

const asyncWrap = require('../../utils/errors/wrap');
const commonValid = require('../../middlewares/validators/common');
const commonController = require('../../controllers/common');

const router = express.Router();

// 버전 체크
router.get('/check-version', commonValid.checkVersion, asyncWrap(commonController.checkVersion));

// 웹
router.get('/', (req, res, next) => {
  res.redirect('http://3.35.154.27:3580');
});

module.exports = router;
