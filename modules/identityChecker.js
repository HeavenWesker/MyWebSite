var bcrypt = require('bcrypt');
var database = require('./database');
function identityChecker(){
}
function tokenChecker(remember_token, callback){
  database.findIDUserByToken(remember_token, callback);
}
function loginChecker(username, password){

}
function saveUserCredit(information, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(information.password, salt, function(err, hash) {
      information.password = hash;
      database.insertUser(information, callback);
    });
  });
}

identityChecker.loginChecker = loginChecker;
identityChecker.tokenChecker = tokenChecker;
identityChecker.saveUserCredit = saveUserCredit;
module.exports = identityChecker;
