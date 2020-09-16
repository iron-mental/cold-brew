var express = require('express');
var router = express.Router();

var usersRouter = require('./users');
var signRouter = require('./sign');

/* routing */
router.use('/users', usersRouter);

router.use('/', signRouter);

module.exports = router;
