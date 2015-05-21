var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/userlist', function(req, res, next) {
  var db = req.db;
  var collection = db.get('userlist');
  //collection.find().toArray(function(err, items){
  //  res.json(items);
  //});
  collection.find({}, {}, function(err, items){
    res.send(items);
    //items.toArray(function(err, items){
    //  res.json(items);
    //});
  });
});
router.post('/adduser', function(req, res){
  var db = req.db;
  var collection = db.get('userlist');
  collection.insert(req.body, function(err, result){
    res.send(
      err === null ? { msg: '' }: { msg: result }
    );
  });
});
router.delete('/deleteuser/:id', function(req, res, next){
  var db = req.db;
  var collection = db.get('userlist');
  collection.remove({
    //'_id': 'ObjectId(' + req.params.id + ')'
    '_id': req.params.id 
  }, 
  function(err){
    res.send(
      err === null ? { 'msg': '' }: { 'msg': err }
    );
  });
});
router.put('/updateuser/:id', function(req, res, next){
  console.log(req.body);
  var db = req.db;
  var collection = db.get('userlist');
  var originData = collection.findById(req.params.id);
  console.log(collection.find({'_id': req.params.id}));
  
  collection.updateById(req.params.id, {
    'username': (req.body.username === null || req.body.username === '') ? originData.username : req.body.username,
    'email': req.body.email === null ? originData.email : req.body.email,
    'fullname': req.body.fullname == null ? originData.fullname : req.body.fullname,
    'age': req.body.age === null ? originData.age : req.body.age,
    'gender': req.body.gender === null ? originData.gender : req.body.gender,
    'location': req.body.location === null ? originData.location : req.body.location
  }, function(err){
    res.send(
      err === null ? { 'msg': '' } : { 'msg': err }
    );
  });
});

module.exports = router;
