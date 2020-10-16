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

// user가 이메일을 통해 링크를 누르면 여기서 트리거
router.get('/parsing', (req, res, next) => {
  return res.redirect(303, req.query.continueUrl);
});

// 실직적으로 처리하는 부분
router.get(
  '/email-verification',
  firebaseValid.emailVerificationProcess,
  asyncWrap(firebaseController.emailVerificationProcess)
);

module.exports = router;
