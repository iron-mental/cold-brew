var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', (req, res) => {
  res.send('<h3>"/"</h3>');
});

module.exports = router;
