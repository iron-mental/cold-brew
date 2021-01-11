const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const v1Router = require('./routes/v1');
const { verify } = require('./middlewares/auth');
const { stream } = require('./configs/winston');
const sentry = require('@sentry/node');
sentry.init({ dsn: process.env.SENTRY_DSN });

const app = express();

app.set('trust proxy', true);
app.use(morgan('combined', { stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(verify);

app.use('/v1', v1Router);
app.use(express.static(__dirname + '/../public'));

// error handler
app.use(sentry.Handlers.errorHandler());
require('./middlewares/error_handler')(app);

module.exports = app;
