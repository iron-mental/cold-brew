const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const studyRouter = require('./study');

/* routing */
router.use('/user', userRouter);
router.use('/study', studyRouter);

module.exports = router;
