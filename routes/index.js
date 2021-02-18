const express = require('express');

const v1Router = require('./v1');
const commonRouter = require('./common');

const router = express.Router();

/* routing */
router.use('/v1', v1Router);
router.use('/', commonRouter);

// 채팅 뷰 제공
router.get('/chat/https', (req, res, next) => {
  res.sendFile(__dirname + '/https.html');
});

router.get('/chat/http', (req, res, next) => {
  res.sendFile(__dirname + '/http.html');
});

module.exports = router;
