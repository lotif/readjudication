var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET hello world page. */
router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'hello, World!' });
});

/* GET merchantlist page. */
router.get('/merchantlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        //res.json(docs);
		setTimeout(function() {
			res.json(docs);
		}, 1000);
    });
});

module.exports = router;