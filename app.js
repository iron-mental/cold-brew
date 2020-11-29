const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const firebase = require('firebase');
const admin = require('firebase-admin');
const fs = require('fs');

const v1Router = require('./routes/v1');
const config = require('./configs/config');
const { verify } = require('./middlewares/auth');

firebase.initializeApp(config.firebase);

admin.initializeApp({
  credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  databaseURL: process.env.FIREBASE_databaseURL,
});

const app = express();

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(verify);

app.use('/v1', v1Router);

app.use(express.static(__dirname + '/../public'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// pre-error handler
app.use((err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {});
  }

  if (err.type === 'validation-error') {
    return res.status(422).json(err);
  } else if (err.type === 'auth-error') {
    return res.status(401).json(err);
  }

  const status = err.status || 500;
  res.status(status);
  delete err.status;
  return res.json(err);
});

module.exports = app;
