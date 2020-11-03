const jwt = require('jsonwebtoken');

const secretKey = 'cjfdkcnldjqgkwk';
const { authError } = require('../utils/errors/customError');

const verify = async (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const decoded = await jwt.verify(req.headers.authorization.split(' ')[1], secretKey);
      res.user = decoded;
      next();
    } catch (err) {
      authError(next, err);
    }
  }
};

module.exports = {
  verify,
};
