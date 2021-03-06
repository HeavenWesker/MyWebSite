var bcrypt = require('bcrypt');
var database = require('./database');
function authorize(){
}
function tokenCheck(remember_token, callback){
  if(remember_token === undefined){
    console.log('remember_token undefined');
    callback(null, null);
    return;
  }
  database.findUserByToken(remember_token, callback);
}
function signinCheck(credit, callback){
  console.log('console');
  console.log(callback);
  database.findUserByCredit(credit, function(err, user){
    if(user == null){
      console.log('WARRING: user not FOND');
      callback(err, false, null);
    }else{
      bcrypt.compare(credit.password, user.password, function(err, result) {
        callback(err, result, user);
      });
    }
  });
}
function saveUserCredit(information, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.genSalt(30, function(err, token){
      bcrypt.hash(information.password, salt, function(err, hash) {
        information.password = hash;
        information.remember_token = token;
        console.log(information);
        database.insertUser(information, callback);
      });
    });
  });
}
function login(user, res, callback){
  res.cookie('remember_token', user.remember_token);
  callback();
}

authorize.signinCheck = signinCheck;
authorize.tokenCheck = tokenCheck;
authorize.saveUserCredit = saveUserCredit;
authorize.login = login;
module.exports = authorize;
