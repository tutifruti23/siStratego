var express = require('express');
var router = express.Router();
var addon = require('../build/Release/engine');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/compMove', function(req, res, next) {

    console.log("zapytanie o ruch");
    console.log(req.query.isMinMax);
    console.log(req.query.eval);
    console.log(req.query.turn)
   var move=addon.pow(req.query.position,req.query.size,0,0,req.query.depth);
    console.log("ruch "+move);
    res.send( move.toString());
});
module.exports = router;
