const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const v1Router = require('./routes/v1');
const { verify } = require('./middlewares/auth');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(verify);

app.use('/v1', v1Router);
app.use(express.static(__dirname + '/../public'));

// error handler
require('./utils/errors/handler')(app);

module.exports = app;
