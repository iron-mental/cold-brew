const express = require('express');
const router = express.Router();

const asyncWrap = require('../../utils/errors/wrap');
const userValid = require('../../utils/validators/user');
const userController = require('../../controllers/user');

router.post('/', userValid.signup, asyncWrap(userController.signup)); // 회원가입
router.delete('/:uid', userValid.withdraw, asyncWrap(userController.withdraw)); // 회원탈퇴

module.exports = router;
