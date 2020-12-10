const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const studyRouter = require('./study');

/* routing */
router.use('/user', userRouter);
router.use('/study', studyRouter);

// 채팅 뷰 제공
router.get('/chat/ios', (req, res, next) => {
  res.sendFile(__dirname + '/index.html');
});

router.get('/chat/android', (req, res, next) => {
  res.sendFile(__dirname + '/index1.html');
});

router.get('/push/test', (req, res, next) => {
  const broadcast = require('../../events/broadcast');
  broadcast.participate(1, 'testNickname');
  return res.json({ message: 1 });
});

module.exports = router;
