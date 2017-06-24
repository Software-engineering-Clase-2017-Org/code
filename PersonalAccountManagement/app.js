var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var util_res_type = require('./utils/resTypes');

var index = require('./routes/index');
var api = require('./routes/api');

var app = express();
app.use(session({
  secret: 'b30a65ee26ae8009d53ea836a0cab057e3f973ee',
  resave: false,
  saveUninitialized: true
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const URL_NO_AUTH_NEED = [
  '/',
  '/api/auth',
  '/api/register',
  '/api/forgot_psw',
  '/api/reset_psw_from_email',
  '/reset_psw_page'
]
app.use('/', index);
app.use((req, res, next) => {
  if(-1 != URL_NO_AUTH_NEED.indexOf(req.url)) {
    next();
    return;
  }
  if(undefined == req.session.user_info) {
    res.send(new util_res_type('尚未登录', false));
    return;
  } else {
    next();
  }
})

// 加载API Controller
app.use('/api', api);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
