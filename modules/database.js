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
    console.log('userArray');
    console.log(userArray);
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
function findAllPost(targetUser, callback){
  if(targetUser == null){
    condition = {};
  }else{
    condition = {user_id: targetUser._id};
  }
  postCollection.find(condition).sort({_id: -1}).toArray(function(err, postArray){
    callback(err, postArray);
  })
}
function findPost(targetUser, callback){ 
  return findBundlePost(targetUser, 20, callback);
}
function findPostBundle(targetUser, pagesize, callback){
  condition = {};
  if(targetUser !== null){
    condition.user_id = targetUser._id;
  }else{
    //condition = {};
    //condition = {user_id: targetUser._id};
  }
  postCollection.find(condition).sort({_id: -1}).limit(pagesize).toArray(function(err, postArray){
    callback(err, postArray);
  })
}
function findPostBundle(targetUser, pagesize, page, action, releative_id, callback){ // new design
  postCollection.find(condition).sort({_id: -1}).limit(pagesize).toArray(function(err, postArray){
    callback(err, postArray);
  })
  // condition = {};
  // if(targetUser !== null){
  //   condition.user_id = targetUser._id;
  // }else{
  //   //condition = {};
  //   //condition = {user_id: targetUser._id};
  // }
  // postCollection.find(condition).sort({_id: -1}).limit(pagesize).toArray(function(err, postArray){
  //   callback(err, postArray);
  // })
}
function findSomePost(condition, callback){
  postCollection.find(condition).sort({_id: -1}).limit(20).toArray(function(err, postArray){
    for(var i = 0; i < postArray.length; i++){
      postArray[i].ISODate = postArray[i]._id.getTimestamp();
    }
    callback(err, postArray);
  })
}
function findPostById(id, callback){
  //callback(postCollection.findOne({_id: mongodb.ObjectId(id)}))
  postCollection.find({_id: new mongodb.ObjectId(id)}).toArray(function(err, postArray){
    callback(err, postArray[0]);
  });
}
database.insertPost = insertPost;
database.insertUser = insertUser;
database.findAllUser = findAllUser;
database.findUserByCredit = findUserByCredit;
database.findUserByToken = findUserByToken;
database.findAllPost = findAllPost;
database.findSomePost = findSomePost;
database.findPostById = findPostById;
module.exports = database;
