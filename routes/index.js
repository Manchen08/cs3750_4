var express = require('express');
var router = express.Router();

const passport = require('../lib/auth').passport;

let User = require('../models/user');

const ensureAuthenticated = require('../lib/auth').ensureAuthenticated;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Stock Page' });
});

router.get('/chatroom', ensureAuthenticated, (req, res, next) => {
  res.render('chatroom', { title: 'Chat Room' });
});

router.get('/addStock', ensureAuthenticated, function(req,res,next){
  res.render('addStock', {title: 'Add Stock'});
});

router.post('/saveStock', ensureAuthenticated, (req, res, next) => {
    const sym = req.body.stock;
    const name = req.body.txtName;

    req.checkBody('stock', 'A chosen stock is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
          req.flash('success_msg','Error');
    } else {
        User.findOne({username:req.user.username}, (err,data) =>
        {
          data.stocks.push({
              fullname: name,
              stock: sym,
              percent: 0
          });
          data.save();
          req.flash('success_msg','Stock saved!');
          res.redirect('/addStock');
        })
    }
});

/*
    View users stocks
*/
router.get('/viewStock', (req, res, next) => {
  User.findOne({username:req.user.username}, (err,data) =>
  {
    res.render('viewStock', {title: 'Your Stocks', stocks: data.stocks})
    //res.status(200).send({stocks:data.stocks});
  })
});

router.get('/listStock', function(req,res,next){
  res.render('listStocks', {title: 'List Stocks'});
});

/*
    Render: Money Management Screen
    Renders the money management page
*/
router.get('/management', ensureAuthenticated, (req, res, next) => {
  res.render('management', {title: 'Money Management', user: req.user.username})
});

/*
    Gets users stocks
*/
router.get('/userstocks', ensureAuthenticated, (req, res, next) => {
  User.findOne({username:req.user.username}, (err,data) =>
  {
    res.status(200).send({stocks:data.stocks});
  })
});



/*
  Temporary cheater to give user stocks
*/
router.get('/cheatstocks', (req, res, next) => {
  User.findOne({username:req.user.username}, (err,data) =>
  {
    data.stocks.push({
        fullname: 'Apple',
        stock: 'aapl',
        percent: 3  
    });
    data.stocks.push({
        fullname: 'Alphabet',
        stock: 'goog',
        percent: 15  
    });
    data.stocks.push({
        fullname: 'Microsoft Corp',
        stock: 'MSFT',
        percent: 19  
    });
    data.save();
  })
});

module.exports = router;