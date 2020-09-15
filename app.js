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
