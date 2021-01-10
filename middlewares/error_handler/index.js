const fs = require('fs');

const { authErrorHandler } = require('./auth');
const { validErrorHandler } = require('./validation');
const { firebaseErrorHandler } = require('./firebase');
const { databaseErrorHandler } = require('./database');
const { customErrorHandler } = require('./custom');
const { logger } = require('../../configs/winston');

const commonErrorHandler = (err, req, res, next) => {
  try {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {});
    }

    const errObj = {
      req: {
        headers: req.headers,
        query: req.query,
        body: req.body,
        route: req.route,
      },
      error: {
        message: err.message,
        stack: err.stack,
        status: err.status,
      },
      user: req.user,
    };

    // logger.error(`${moment().format('YYYY-MM-DD HH:mm:ss')}`, errObj);
    logger.error(errObj);

    if (req.file) {
      fs.unlink(req.file.path, (error) => {});
    }
    next(err);
  } catch (err) {
    console.error(err);
  }
};

module.exports = (app) => {
  app.use(commonErrorHandler);
  app.use(authErrorHandler);
  app.use(validErrorHandler);
  app.use(firebaseErrorHandler);
  app.use(databaseErrorHandler);
  app.use(customErrorHandler);

  // other Error
  app.use((err, req, res, next) => {
    return res.status(500).json({
      result: false,
      message: err,
    });
  });
};
