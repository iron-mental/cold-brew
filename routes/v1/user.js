const express = require('express');

const { imageUpload } = require('../../utils/file');
const asyncWrap = require('../../utils/errors/wrap');
const userValid = require('../../utils/validators/user');
const userController = require('../../controllers/user');
const studyValid = require('../../utils/validators/study');
const studyController = require('../../controllers/study');

const router = express.Router();

router.get('/check-nickname/:nickname', userValid.checkNickname, asyncWrap(userController.checkNickname)); // 닉네임 중복체크
router.get('/check-email/:email', userValid.checkEmail, asyncWrap(userController.checkEmail)); // 이메일 중복체크

router.post('/', userValid.signup, asyncWrap(userController.signup)); // 회원 가입
router.post('/login', userValid.login, asyncWrap(userController.login)); // 로그인

router.get('/:id', userValid.userDetail, asyncWrap(userController.userDetail)); // 유저 상세조회
router.patch('/:id', imageUpload, userValid.userUpdate, asyncWrap(userController.userUpdate)); // 유저 정보수정
router.delete('/:id', userValid.withdraw, asyncWrap(userController.withdraw)); // 회원 탈퇴

router.get('/emailVerify/:email', userValid.emailVerification, asyncWrap(userController.emailVerification)); // 이메일 인증 요청
router.get('/emailVerify-process/:email', userValid.emailVerificationProcess, asyncWrap(userController.emailVerificationProcess)); // 이메일 인증 요청

router.get('/:user_id/study', studyValid.myStudy, asyncWrap(studyController.myStudy)); // 내 스터디 조회

module.exports = router;
