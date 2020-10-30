const express = require('express');

const asyncWrap = require('../../utils/errors/wrap');
const firebaseValid = require('../../utils/validators/firebase');
const firebaseController = require('../../controllers/firebase');

const router = express.Router();

router.post('/reset-password/:email', firebaseValid.resetPassword, asyncWrap(firebaseController.resetPassword)); // 비밀번호 리셋 요청

module.exports = router;
