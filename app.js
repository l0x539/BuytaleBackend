const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  key: 'SID_SESS',
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 600000
  }
}));

if (process.env.NODE_ENV === 'production') {
  app.use(compression());
}

// app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', apiRouter);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public') + '/index.html');
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
