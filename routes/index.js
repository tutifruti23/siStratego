var express = require('express');
var router = express.Router();
var addon = require('../build/Release/engine');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/compMove', function(req, res, next) {

    console.log("zapytanie o ruch");
    if(req.query.position.includes('0')){
        var move=addon.pow(req.query.position,req.query.size,req.query.pts1,req.query.pts2,req.query.depth,req.query.eval,req.query.isMinMax,req.query.turn);
        console.log("ruch "+move);
        res.send( move.toString());
    }

});
module.exports = router;
