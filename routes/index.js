var express = require('express');
var router = express.Router();

const ensureAuthenticated = require('../lib/auth').ensureAuthenticated;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Chat' });
});

router.get('/chatroom', ensureAuthenticated, (req, res, next) => {
  res.render('chatroom', { title: 'Chat Room' });
});

router.get('/addStock', function(req,res,next){
  res.render('addStock', {title: 'Add Stock'});
});
module.exports = router;