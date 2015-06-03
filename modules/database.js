var bcrypt = require('bcrypt');
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/MyWebSite';
var userCollection;
var postCollection;
init();

function init(){
  mongoClient.connect(url, function(err, database){
    if(!err){
      userCollection = database.collection('userlist');
      postCollection = database.collection('postlist');
    }
  });
}
function database(){
}
function insertPost(post, callback){
  postCollection.insert(post, function(err, result){
    callback(err, result);
  });
}
function insertUser(information, callback){
  userCollection.insert(information, function(err, result){
    callback(err, result);
  });
}
function findUserIDByToken(token, callback){
  userCollection.find({remember_token: token}, {_id: 1})
  .toArray(function(err, userIdArray){
    callback(userIdArray[0]);
  });
}
function newPost(user_id, post, callback){
}
function findAllUser(callback){
  userCollection.find({}).toArray(function(err,data){
    callback(err, data);
  });
}
database.insertPost = insertPost;
database.insertUser = insertUser;
database.findAllUser = findAllUser;
module.exports = database;
