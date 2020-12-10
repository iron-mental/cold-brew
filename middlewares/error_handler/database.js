const { DatabaseError } = require('../../utils/errors/database');

const databaseErrorHandler = (err, req, res, next) => {
  if (err instanceof DatabaseError) {
    return res.status(500).json(err);
  }
  return next(err);
};

module.exports = {
  databaseErrorHandler,
};
