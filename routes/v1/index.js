var express = require('express');
var router = express.Router();

var userRouter = require('./user');

/* routing */
router.use('/user', userRouter);

module.exports = router;
