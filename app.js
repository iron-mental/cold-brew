const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const firebase = require('firebase');

const v1Router = require('./routes/v1');
const config = require('./configs/config');

const app = express();
firebase.initializeApp(config.firebase);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/v1', v1Router);

app.use(express.static(__dirname + '/../public'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const fs = require('fs');
// error handler
app.use((err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {});
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (!err.status) {
    console.error(err);
  }

  res.status(err.status || 500);
  return res.json({ message: err.message });
});

module.exports = app;
