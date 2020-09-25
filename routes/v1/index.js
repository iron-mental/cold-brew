var express = require('express');
var router = express.Router();

var authRouter = require('./auth');
var userRouter = require('./user');

/* routing */
router.use('/auth', authRouter);
router.use('/user', userRouter);

module.exports = router;
