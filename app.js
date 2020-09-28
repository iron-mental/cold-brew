const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const v1Router = require('./routes/v1');

const app = express();

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

  if (!err.status) {
    console.error(err);
  }

  res.status(err.status || 500);
  return res.json({ message: err.message });
});

// app.use( handleDatabaseError(error, req, res, next) =>{
//   if (error instanceof MysqlError) {
//     res.status(503).json({
//       type: "MysqlError",
//       message: error.message,
//     })
//   }
//   next(error)
// })

module.exports = app;
