var express = require('express');
var router = express.Router();
var signController = require('../../controllers/sign');

/* sign */
router.post('/signup', signController.signup);
// router.post('/login', signController.login);
// router.post('/logout', signController.logout);

// router.delete('/signout', (req, res, next) => {
//   // 구현안함
// });

module.exports = router;
