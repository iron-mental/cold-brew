const express = require('express');

const userRouter = require('./user');
const studyRouter = require('./study');

const router = express.Router();

/* routing */
router.use('/user', userRouter);
router.use('/study', studyRouter);

// 채팅 뷰 제공
router.get('/chat/https', (req, res, next) => {
  res.sendFile(__dirname + '/https.html');
});

router.get('/chat/http', (req, res, next) => {
  res.sendFile(__dirname + '/http.html');
});

module.exports = router;
