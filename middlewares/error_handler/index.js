const { authErrorHandler } = require('./auth');
const { validErrorHandler } = require('./validation');
const { firebaseErrorHandler } = require('./firebase');
const { databaseErrorHandler } = require('./database');
const { customErrorHandler } = require('./custom');
const { commonErrorHandler } = require('./common');

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
