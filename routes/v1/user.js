const express = require('express');
const router = express.Router();

const asyncWrap = require('../../utils/errors/wrap');
const valid = require('../../utils/validators/userSchema');
const controller = require('../../controllers/user');

router.post('/', valid.signup, asyncWrap(controller.signup)); // 회원가입
router.delete('/:uid', valid.withdraw, asyncWrap(controller.withdraw)); // 회원탈퇴

module.exports = router;
