const fs = require('fs');
const { format } = require('date-fns');
const { logger, getErrorObject } = require('../../configs/winston');

const commonErrorHandler = (err, req, res, next) => {
  const errorObject = getErrorObject(req, err);
  logger.error(``, errorObject);

  if (req.file) {
    fs.unlink(req.file.path, (err) => {});
  }
  next(err);
};

module.exports = {
  commonErrorHandler,
};
