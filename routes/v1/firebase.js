const express = require('express');

const asyncWrap = require('../../utils/errors/wrap');
const firebaseValid = require('../../utils/validators/firebase');
const firebaseController = require('../../controllers/firebase');

const router = express.Router();

router.post('/email-verification/:id', firebaseValid.emailVerification, asyncWrap(firebaseController.emailVerification)); // 이메일 인증 요청
router.get('/email-verification', firebaseValid.emailVerificationProcess, asyncWrap(firebaseController.emailVerificationProcess)); // 이메일 인증

router.post('/reset-password/:email', firebaseValid.resetPassword, asyncWrap(firebaseController.resetPassword)); // 비밀번호 리셋 요청

module.exports = router;
