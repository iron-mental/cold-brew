const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const v1Router = require('./routes/v1');
const { verify } = require('./middlewares/auth');

const app = express();

app.set('trust proxy', true);
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(verify);

app.use('/v1', v1Router);
app.use(express.static(__dirname + '/../public'));

// error handler
require('./middlewares/error_handler')(app);

module.exports = app;
