const { check, validationResult } = require('express-validator');

let signup = [
  check('uid').isAlphanumeric(),
  check('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address!'),
  check('nickname').isLength({ min: 2, max: 8 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

module.exports = { signup };
