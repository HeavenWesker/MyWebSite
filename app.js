var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var authorize = require('./modules/authorize')

var mongodb = require('mongodb');
//var monk = require('monk');
var mongoClient = mongodb.MongoClient;
//var db = monk('localhost:27017/MyWebSite');
var db;
var url = 'mongodb://localhost:27017/MyWebSite';
mongoClient.connect(url, function(err, database){
  if(!err){
    db = database;
  }
});

var routes = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  authorize.signinCheck(req.body, function(err, result, currentUser){
    req.currentUser = currentUser;
    next();
  })
});
app.use(function(req, res, next){
  console.log('checkToken');
  authorize.tokenCheck(req.cookies.remember_token, function(err, currentUser){
    if(!err){
      console.log('No Error');
      console.log(currentUser);
    }
    req.currentUser = currentUser;
    next();
  })
  console.log('checkTokenFinished');
})


app.use('/', routes);
app.use('/users', users);
app.use('/posts', posts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      status: err.status,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
