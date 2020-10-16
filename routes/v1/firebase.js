const express = require('express');

const asyncWrap = require('../../utils/errors/wrap');
const firebaseValid = require('../../utils/validators/firebase');
const firebaseController = require('../../controllers/firebase');

const router = express.Router();

router.post(
  '/email-verification/:id',
  firebaseValid.emailVerification,
  asyncWrap(firebaseController.emailVerification)
);

// DB 수정
router.get(
  '/email-verification',
  firebaseValid.emailVerificationProcess,
  asyncWrap(firebaseController.emailVerificationProcess)
);

router.post('/reset-password/:email', firebaseValid.resetPassword, asyncWrap(firebaseController.resetPassword));

module.exports = router;
