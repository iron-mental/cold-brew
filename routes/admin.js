const express = require('express');

const { checkAdmin } = require('../middlewares/auth');
const asyncWrap = require('../utils/errors/wrap');
const adminValid = require('../middlewares/validators/admin');
const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/redis/reset', checkAdmin, asyncWrap(adminController.resetRedis));
router.get('/redis/user/:user_id', checkAdmin, adminValid.getRedis, asyncWrap(adminController.getRedis));

router.delete('/study/empty', checkAdmin, asyncWrap(adminController.deleteEmptyStudy));

router.post('/version', checkAdmin, adminValid.setVersion, asyncWrap(adminController.setVersion));

module.exports = router;
