const fs = require('fs');

const { authErrorHandler } = require('./auth');
const { validErrorHandler } = require('./validation');
const { firebaseErrorHandler } = require('./firebase');
const { databaseErrorHandler } = require('./database');
const { customErrorHandler } = require('./custom');

const fileRemover = (err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (error) => {});
  }
  next(err);
};

module.exports = (app) => {
  app.use(fileRemover);
  app.use(authErrorHandler);
  app.use(validErrorHandler);
  app.use(firebaseErrorHandler);
  app.use(databaseErrorHandler);
  app.use(customErrorHandler);
};
