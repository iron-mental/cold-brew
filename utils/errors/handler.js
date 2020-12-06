const { authErrorHandler } = require('./auth');
const { validErrorHandler } = require('./validation');
const { firebaseErrorHandler } = require('./firebase');
const { customErrorHandler } = require('./customError');

module.exports = (app) => {
  app.use((err, req, res, next) => {
    if (req.file) {
      fs.unlink(req.file.path, (error) => {});
    }
    next(err);
  });

  app.use(authErrorHandler);
  app.use(validErrorHandler);
  app.use(firebaseErrorHandler);
  app.use(customErrorHandler);
};
