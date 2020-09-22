const { check, validationResult } = require('express-validator');

let signup = [
  check('uid').isAlphanumeric().withMessage('Invalid uid'),
  check('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  check('nickname')
    .isAlphanumeric()
    .withMessage('Invalid nickname')
    .isLength({ min: 2, max: 8 })
    .withMessage('lengthError nickname'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) next({ status: 422, message: errors.errors });
    next();
  },
];

let withdraw = [
  check('uid').isAlphanumeric().withMessage('Invalid uid'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) next({ status: 422, message: errors.errors });
    next();
  },
];

module.exports = { signup, withdraw };
