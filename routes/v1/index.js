var express = require('express');
var router = express.Router();

var userRouter = require('./user');
var studyRouter = require('./study');

/* routing */
router.use('/user', userRouter);
router.use('/study', studyRouter);

module.exports = router;
