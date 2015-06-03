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
    callback(err, information.remember_token, result);
  });
}
function findUserByCredit(credit, callback){
  userCollection.find({username: credit.username})
  .toArray(function(err, userArray){
    callback(err, userArray[0]);
  });
}
function findUserIDByToken(token, callback){
  userCollection.find({remember_token: token}, {_id: 1})
  .toArray(function(err, userIdArray){
    callback(err, userIdArray[0]);
  });
}
function findUserByToken(token, callback){
  userCollection.find({remember_token: token}, {password: 0, remember_token: 0})
  .toArray(function(err, userIdArray){
    callback(err, userIdArray[0]);
  });
}
function newPost(user_id, post, callback){
}
function findAllUser(callback){
  userCollection.find({}).toArray(function(err,data){
    callback(err, data);
  });
}
function findAllPost(user, targetUser, callback){
  postCollection.find({}).toArray(function(err, postArray){
    callback(err, postArray);
  })
}
database.insertPost = insertPost;
database.insertUser = insertUser;
database.findAllUser = findAllUser;
database.findUserByCredit = findUserByCredit;
database.findUserByToken = findUserByToken;
database.findAllPost = findAllPost;
module.exports = database;
