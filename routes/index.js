var express = require('express');
var router = express.Router();
var authorize = require('../modules/authorize');
var database = require('../modules/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  authorize.tokenCheck(req.cookies.remember_token, function(err, currentUser){
    if(err){
      console.log(err);
      next();
    }else if(currentUser == null){
      res.render('index', { title: 'Talk'});
    }else{
      database.findAllPost(null, function(err, postArray){
        console.log(postArray);
        res.render('home', { title: 'Talk', postArray: postArray });
      });
    }
  });
});
router.get('/signin', function(req, res, next){
  console.log(req.cookies.remember_token);
  res.render('signin', { title: 'Sign In'});
});
router.post('/signin', function(req, res, next){
  authorize.signinCheck(req.body, function(err, result, user){
    if(result){
      authorize.login(user, res, function(){
        res.redirect('/');
      })
    }else{
      res.render('signin', { title: 'signin', error: 'Username and Password not match'} );
    }
  });
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
router.get('/signup', function(req, res, next){
  res.render('index', { title: 'signup'})
});
//router.get('/newuser', function(req, res, next){
//  res.render('newuser', { title: 'newuser' });
//});
// router.post('/adduser', function(req, res, next){
//   var db = req.db;
//   var usercollection = db.get('usercollection');
//   var userName = req.body.username;
//   var userEmail = req.body.useremail;
//   usercollection.insert({
//     'username' : userName,
//     'useremail' : userEmail
//   }, function(error, doc){
//     if(error){
//       res.send('There are some error with the database');
//     }else{
//       res.location('/userlist');
//       res.redirect('/userlist');
//     }
//   });
// });
router.get('/newpost', function(req, res, next){
  res.render('newpost', {title: 'New Post'});
});
router.post('/newpost', function(req, res, next){
  authorize.tokenCheck(req.cookies.remember_token, function(err, user){
    if(user === undefined){
      res.redirect('/signin');
      res.location('/signin');
    }else{
      req.body.user_id = user._id;
      database.insertPost(req.body, function(err, result){
        //res.send( err === null ? { msg: result } : { err: err });
        //res.render('home');
        res.redirect('/');
      });
    }
  });
})

module.exports = router;
