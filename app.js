var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
// var { stream, logger } = require('./configs/winston');

var v1Router = require('./routes/v1');

var app = express();

// app.use(morgan('combined', { stream }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/v1', v1Router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// // error handler
// app.use(function (err, req, res, next) {
//   let terminalError = err;
//   if (!err.status) {
//     terminalError = createError(err);
//   }

//   if (process.env.NODE_ENV === 'test') {
//     const errObj = {
//       req: {
//         headers: req.headers,
//         query: req.query,
//         body: req.body,
//         route: req.route,
//       },
//       error: {
//         message: terminalError.message,
//         stack: terminalError.stack,
//         status: terminalError.status,
//       },
//       user: req.user,
//     };

//     logger.error(`${moment().format('YYYY-MM-DD HH:mm:ss')}`, errObj);
//   } else {
//     // set locals, only providing error in development
//     res.locals.message = terminalError.message;
//     res.locals.error = terminalError;
//   }

//   // render the error page
//   return response(
//     res,
//     {
//       message: terminalError.message,
//     },
//     terminalError.status
//   );
