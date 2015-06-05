var express = require('Express');
var router = express.Router();
var mongodb = require('mongodb');
var authorize = require('../modules/authorize');
var database = require('../modules/database');
var url = 'mongodb://localhost:27017/MyWebSite';
router.get('/postlist', function(req, res, next){
  var mongoClient = mongodb.MongoClient;
  mongoClient.connect(url, function(err, database){
    var collection = database.collection('postlist');
    collection.find({}).toArray(function(err, data){
      res.send(data);
    });
  });
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
