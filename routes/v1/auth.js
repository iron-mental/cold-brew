var express = require('express');
var router = express.Router();

const authValid = require('../../utils/validators/auth');
const authController = require('../../controllers/auth');

router.post('/signup', authValid.signup, authController.signup);
router.delete('/withdraw', authController.withdraw);

module.exports = router;
