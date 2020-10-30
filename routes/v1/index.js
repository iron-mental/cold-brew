const express = require('express');
const router = express.Router();

var userRouter = require('./user');
var studyRouter = require('./study');
var firebaseRouter = require('./firebase');

/* routing */
router.use('/user', userRouter);
router.use('/study', studyRouter);
router.use('/firebase', firebaseRouter);

module.exports = router;
