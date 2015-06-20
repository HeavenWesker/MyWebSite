var express = require('Express');
var router = express.Router();
var mongodb = require('mongodb');
var authorize = require('../modules/authorize');
var database = require('../modules/database');
//var url = 'mongodb://localhost:27017/MyWebSite';
router.get('/postlist', function(req, res, next){
  //var mongoClient = mongodb.MongoClient;
  //mongoClient.connect(url, function(err, database){
  //  var collection = database.collection('postlist');
  //  collection.find({}).toArray(function(err, data){
  //    res.send(data);
  //  });
  //});
  // if(req.currentUser === null){
  //   res.send('401');
  //   next();
  // }
  condition = {};
  if(req.query.action === 'old' && req.query.oldid !== undefined){
    condition._id = { $lt: new mongodb.ObjectID(req.query.oldid)  };
  }else if(req.query.action === 'new' && req.query.newid !== undefined){
    condition._id = { $gt: new mongodb.ObjectID(req.query.newid)  };
  }
  // database.findSomePost(condition, function(err, postArray){
  //   res.render('home', {title: 'Talk', currentUser: req.currentUser, postArray: postArray });
  // })
  console.log(condition);
  database.findSomePost(condition, function(err, postArray){
    res.send(postArray);
  })
});
router.post('/newpost', function(req, res){
  authorize.tokenCheck(req.cookies.remember_token, function(err, user){
    if(user === undefined){
      res.redirect('/signin');
      res.location('/signin');
    }else{
      req.body.user_id = user._id;
      database.insertPost(req.body, function(err, result){
        res.send( err === null ? { msg: result } : { err: err });
      });
    }
  });
});
//router.get('/newpost', function(req, res, next){
//  res.render('newpost', {title: 'New Post'});
//});
module.exports = router;
