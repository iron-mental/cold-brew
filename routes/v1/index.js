const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const studyRouter = require('./study');
const adminRouter = require('./admin');

/* routing */
router.use('/user', userRouter);
router.use('/study', studyRouter);
router.use('/admin', adminRouter);

// 채팅 뷰 제공
router.get('/chat/https', (req, res, next) => {
  res.sendFile(__dirname + '/https.html');
});

router.get('/chat/http', (req, res, next) => {
  res.sendFile(__dirname + '/http.html');
});

module.exports = router;
