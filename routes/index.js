var express = require('express');
var router = express.Router();

const passport = require('../lib/auth').passport;

let User = require('../models/user');

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

router.get('/management', (req, res, next) => {
        //User.findOne({username:req.user.username}, (err,data) =>
        //{
  res.render('management', {title: 'Money Management', user: req.user.username})
});

router.get('/userstocks', (req, res, next) => {
  User.findOne({username:req.user.username}, (err,data) =>
  {
    res({stocks:data.stocks});
  })
});

module.exports = router;