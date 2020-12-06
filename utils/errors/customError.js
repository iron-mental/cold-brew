class CustomError extends Error {
  constructor(status, message) {
    super();
    this.result = false;
    this.message = message;
    this.status = status;
  }
}

const customError = (status, message) => {
  return new CustomError(status, message);
};

const customErrorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status = err.status;
    delete err.status;
    return res.json(err);
  }
  return next(err);
};

module.exports = {
  customError,
  customErrorHandler,
};
