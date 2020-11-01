const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const firebase = require('firebase');
const admin = require('firebase-admin');

const v1Router = require('./routes/v1');
const config = require('./configs/config');
const response = require('./utils/response');

firebase.initializeApp(config.firebase);

admin.initializeApp({
  credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  databaseURL: process.env.FIREBASE_databaseURL,
});

const app = express();

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

  response(res, err.message, err.status || 500);
});

module.exports = app;
