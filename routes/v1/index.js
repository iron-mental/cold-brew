var express = require('express');
var router = express.Router();

var userRouter = require('./user');
var firebaseRouter = require('./firebase');

/* routing */
router.use('/user', userRouter);
router.use('/firebase', firebaseRouter);

module.exports = router;
