const express = require('express');
const router = express.Router();

const asyncWrap = require('../../utils/errors/wrap');
const userValid = require('../../utils/validators/user');
const userController = require('../../controllers/user');

router.post('/', userValid.signup, asyncWrap(userController.signup)); // 회원 가입

router.get('/:uid', userValid.userDetail, asyncWrap(userController.userDetail)); // 유저 상세조회
router.patch('/:uid', userValid.userUpdate, asyncWrap(userController.userUpdate)); // 유저 정보수정
router.delete('/:uid', userValid.withdraw, asyncWrap(userController.withdraw)); // 회원 탈퇴

router.get('/check/:nickname', userValid.checkNickname, asyncWrap(userController.checkNickname)); // 닉네임 중복체크

module.exports = router;
