var mongodb = require('mongodb');
var BSON = mongodb.BSONPure;
var express = require('express');
var router = express.Router();
var database = require('../modules/database');
var authorize = require('../modules/authorize')

/* GET users listing. */
router.get('/userlist', function(req, res, next) {
  database.findAllUser(function(err, data){
    res.send(data);
  })
  // var db = req.db;
  // var collection = db.collection('userlist');
  // //collection.find().toArray(function(err, items){
  // //  res.json(items);
  // //});
  // //collection.find({}, {}, function(err, items){
  // //  res.send(items);
  // //  //items.toArray(function(err, items){
  // //  //  res.json(items);
  // //  //});
  // //});
  // collection.find({}).toArray(function(err, data){
  //   //console.log(data);
  //   res.send(data);
  // });
  // //res.send(collection.find({}).toArray());
});
router.post('/adduser', function(req, res){
  authorize.saveUserCredit(req.body, function(err, remember_token, result){
    if(!err){
      res.cookie('remember_token', remember_token)
    }
    res.send(
      err === null ? { msg: result } : { err: err}
    );
  });
  // console.log(req.body);
  // var db = req.db;
  // var collection = db.collection('userlist');
  // collection.insert(req.body, function(err, result){
  //   console.log(result);
  //   res.send(
  //     (err === null) ? { msg: result }: { 'err': err.message }
  //   );
  // });
});
router.delete('/deleteuser/:id', function(req, res, next){
  var db = req.db;
  var collection = db.collection('userlist');
  //collection.find({_id:new mongodb.ObjectId(req.params.id)}).toArray(function(err, data){
  //  console.log(data);
  //});
  collection.remove({
    //'_id': 'ObjectId(' + req.params.id + ')'
    //_id: '\''+req.params.id+'\''
    _id: new mongodb.ObjectId(req.params.id)
  }, 
  function(err, result){
    res.send(
      (err === null) ? { msg: result }: { 'err': err.message }
    );
  });
});
router.put('/updateuser/:id', function(req, res, next){
  console.log(req.body);
  var db = req.db;
  var collection = db.get('userlist');
  collection.findAndModify({ query: {'_id': req.params.id}, update: req.body }, {}, function(err){
    res.send(
      (err === null) ? { msg: result }: { 'err': err.message }
    );
  });
  //collection.findById(req.params.id, {}, {}, function(err, items){
  //  collection.updateById(req.params.id, {
  //    'username': (req.body.username === null || req.body.username === '') ? items[0].username : req.body.username,
  //    'email': (req.body.email === null || req.body.email == '') ? originData.email : req.body.email,
  //    'fullname': (req.body.fullname === null || req.body.fullname === '') ? originData.fullname : req.body.fullname,
  //    'age': (req.body.age === null || req.body.age === '') ? originData.age : req.body.age,
  //    'gender': (req.body.gender === null || req.body.gender === '') ? originData.gender : req.body.gender,
  //    'location': (req.body.location === null || req.body.location === '') ? originData.location : req.body.location
  //  }, function(err){
  //    res.send(
  //      err === null ? { 'msg': '' } : { 'msg': err }
  //    );
  //  });
  //});
  //console.log(collection.find({'_id': req.params.id}));
  
  //collection.updateById(req.params.id, {
  //  'username': (req.body.username === null || req.body.username === '') ? originData.username : req.body.username,
  //  'email': (req.body.email === null || req.body.email == '') ? originData.email : req.body.email,
  //  'fullname': (req.body.fullname === null || req.body.fullname === '') ? originData.fullname : req.body.fullname,
  //  'age': (req.body.age === null || req.body.age === '') ? originData.age : req.body.age,
  //  'gender': (req.body.gender === null || req.body.gender === '') ? originData.gender : req.body.gender,
  //  'location': (req.body.location === null || req.body.location === '') ? originData.location : req.body.location
  //}, function(err){
  //  res.send(
  //    err === null ? { 'msg': '' } : { 'msg': err }
  //  );
  //});
});

module.exports = router;
