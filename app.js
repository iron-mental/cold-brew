const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const firebase = require('firebase');
const admin = require('firebase-admin');

const v1Router = require('./routes/v1');
const config = require('./configs/config');
const errorHandler = require('./utils/errors/customHandler');

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

// pre-error handler
app.use(errorHandler);

module.exports = app;
