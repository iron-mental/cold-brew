const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const studyRouter = require('./study');
const firebaseRouter = require('./firebase');

/* routing */
router.use('/user', userRouter);
router.use('/study', studyRouter);
router.use('/firebase', firebaseRouter);

module.exports = router;
