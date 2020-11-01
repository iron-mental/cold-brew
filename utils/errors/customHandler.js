const fs = require('fs');

module.exports = (err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {});
  }

  switch (err.type) {
    case 'validation-error':
      res.status(422).json(err);
      break;
    default:
      response(res, err.message, err.status || 500);
      break;
  }
};
