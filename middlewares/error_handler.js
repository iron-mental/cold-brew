const { AuthError } = require('../utils/errors/auth');
const { ValidError } = require('../utils/errors/validation');
const { FirebaseError } = require('../utils/errors/firebase');
const { CustomError } = require('../utils/errors/custom');
const { DatabaseError } = require('../utils/errors/database');

const fileRemover = (err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (error) => {});
  }
  next(err);
};

const authErrorHandler = (err, req, res, next) => {
  if (err instanceof AuthError) {
    return res.status(401).json(err);
  }
  return next(err);
};

const validErrorHandler = (err, req, res, next) => {
  if (err instanceof ValidError) {
    return res.status(422).json(err);
  }
  return next(err);
};

const firebaseErrorHandler = (err, req, res, next) => {
  if (err instanceof FirebaseError) {
    const status = err.status;
    delete err.status;
    return res.status(status).json(err);
  }
  return next(err);
};

const databaseErrorHandler = (err, req, res, next) => {
  if (err instanceof DatabaseError) {
    return res.status(500).json(err);
  }
  return next(err);
};

const customErrorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    const status = err.status;
    delete err.status;
    return res.status(status).json(err);
  }
  return next(err);
};

module.exports = (app) => {
  app.use(fileRemover);
  app.use(authErrorHandler);
  app.use(validErrorHandler);
  app.use(firebaseErrorHandler);
  app.use(databaseErrorHandler);
  app.use(customErrorHandler);
};
