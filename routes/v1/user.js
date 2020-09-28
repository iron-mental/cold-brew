const express = require('express');
const router = express.Router();

const asyncWrap = require('../../utils/errors/wrap');
const userValid = require('../../utils/validators/user');
const userController = require('../../controllers/user');

router.post('/', userValid.signup, asyncWrap(userController.signup)); // 회원 가입
router.post('/login', userValid.login, asyncWrap(userController.login)); // 로그인
router.get('/check', userValid.check, asyncWrap(userController.check)); // 중복체크

router.get('/:id', userValid.detail, asyncWrap(userController.detail)); // 유저 상세조회
router.patch('/:id', userValid.update, asyncWrap(userController.update)); // 유저 정보수정
router.delete('/:id', userValid.withdraw, asyncWrap(userController.withdraw)); // 회원 탈퇴

// router.get(
//   '/check/:nickname',
//   userValid.checkNickname,
//   asyncWrap(userController.checkNickname)
// ); // 닉네임 중복체크

module.exports = router;
