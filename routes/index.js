var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/helloworld', function(req, res, next) {
  res.render('helloworld', { title: 'HelloWorld' });
});
router.get('/signin', function(req, res, next){
  res.render('signin', { title: 'Sign In'});
});
router.get('/userlist', function(req, res, next){
  var db = req.db;
  var usercollection = db.get('usercollection');
  usercollection.find({},{},function(e,docs){
    res.render('userlist',{
      'userlist': docs
    });
    //res.send('userList');
  });
});
router.get('/newuser', function(req, res, next){
  res.render('newuser', { title: 'newuser' });
});
router.post('/adduser', function(req, res, next){
  var db = req.db;
  var usercollection = db.get('usercollection');
  var userName = req.body.username;
  var userEmail = req.body.useremail;
  usercollection.insert({
    'username' : userName,
    'useremail' : userEmail
  }, function(error, doc){
    if(error){
      res.send('There are some error with the database');
    }else{
      res.location('/userlist');
      res.redirect('/userlist');
    }
  });
});

module.exports = router;
