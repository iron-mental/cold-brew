const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const studyRouter = require('./study');
const firebaseRouter = require('./firebase');

/* routing */
router.use('/user', userRouter);
router.use('/study', studyRouter);
router.use('/firebase', firebaseRouter);

// 채팅 뷰 제공
router.get('/chat/ios', (req, res, next) => {
  res.sendFile(__dirname + '/index.html');
});

router.get('/chat/android', (req, res, next) => {
  res.sendFile(__dirname + '/index1.html');
});

module.exports = router;
