const fs = require('fs');
const { format } = require('date-fns');
const { logger } = require('../../configs/winston');

const commonErrorHandler = (err, req, res, next) => {
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
  logger.error(`${format(new Date(), 'yyyy-MM-dd HH:mm:ss', { timezone: 'GMT-9' })}`, errObj);

  if (req.file) {
    fs.unlink(req.file.path, (err) => {});
  }

  next(err);
};

module.exports = {
  commonErrorHandler,
};
