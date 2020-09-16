var express = require('express');
var router = express.Router();

/* GET users listing. */
router
  .route('/')
  .get((req, res, next) => {
    console.log(`/v1/users [get]`);
  })
  .post(() => {
    console.log('/v1/users [post]');
  });

router
  .route('/:id')
  .get((err, req, res, next) => {
    // console.log(`/v1/users/:id [get], req: ${req.params.id}`);
  })
  .post((req, res, next) => {
    console.log(`/v1/users/:id [post], req: ${req.params.id}`);
    return res.json({ test: 'test' });
  });

module.exports = router;
