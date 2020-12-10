const { CustomError } = require('../../utils/errors/custom');

const customErrorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    const status = err.status;
    delete err.status;
    return res.status(status).json(err);
  }
  return next(err);
};

module.exports = {
  customErrorHandler,
};
