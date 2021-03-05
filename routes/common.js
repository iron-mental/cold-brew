const express = require('express');

const asyncWrap = require('../utils/errors/wrap');
const commonValid = require('../middlewares/validators/common');
const commonController = require('../controllers/common');

const router = express.Router();

router.get('/check-version', commonValid.checkVersion, asyncWrap(commonController.checkVersion));

router.get('/', (req, res, next) => {
  res.redirect(301, process.env.WEB);
});

router.get('/terms', (req, res, next) => {
  res.redirect(301, process.env.TERMS);
});

router.get('/privacy', (req, res, next) => {
  res.redirect(301, process.env.PRIVACY);
});

module.exports = router;
