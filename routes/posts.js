var express = require('Express');
var router = express.Router();
var mongodb = require('mongodb');
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
router.post('/newPost', function(req, res){
  var mongoClient = mongodb.MongoClient;
  mongoClient.connect(url, function(err, database){
    var collection = database.collection('postlist');
    //var userId = 
    database.collection('userlist').
      find({cookie:req.cookies.userCookie}, ['_id']).toArray(function(err,userIDs){
      if(userIDs && userIDs.length === 1){
        console.log(userIDs);
        var newPost = req.body;
        newPost.user_id = userIDs[0];
        collection.insert(req.body, function(err, result){
          res.send(
            (err === null) ? { msg: result }: { 'err': err.message }
          );
        });
      }else{
        res.redirect('/login');
      }
    });
  });
});
router.get('/newpost', function(req, res, next){
  //res.cookie('userCookie','123456');
  //console.log('cookie setted');
  res.render('newpost', {title: 'New Post'});
});
module.exports = router;
