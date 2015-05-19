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

module.exports = router;
