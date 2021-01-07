const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const studyRouter = require('./study');

/* routing */
router.use('/user', userRouter);
router.use('/study', studyRouter);

// 채팅 뷰 제공
router.get('/chat/https', (req, res, next) => {
  console.log('https');
  res.sendFile(__dirname + '/https.html');
});

router.get('/chat/http', (req, res, next) => {
  console.log('http');
  res.sendFile(__dirname + '/http.html');
});

router.get('/push/test', (req, res, next) => {
  const broadcast = require('../../events/broadcast');
  broadcast.participate(1, 'testNickname');
  return res.json({ message: 1 });
});

module.exports = router;
