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

module.exports = {
  CustomError,
  customError,
};
