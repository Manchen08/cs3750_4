var express = require('express');
var router = express.Router();

const passport = require('../lib/auth').passport;

let User = require('../models/user');

const ensureAuthenticated = require('../lib/auth').ensureAuthenticated;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Stock Page' });
});

router.get('/addStock', ensureAuthenticated, function(req,res,next){
  res.render('addStock', {title: 'Add Stock'});
});

router.post('/saveStock', ensureAuthenticated, (req, res, next) => {
    const sym = req.body.symName;
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

router.get('/listStock', (req,res,next) => {
  User.findOne({username:req.user.username}, (err,data) =>
  {
    res.render('listStock', {title: 'List Stocks', stocks:data.stocks});
  })
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
  updates users stocks
*/
router.put('/userstocks', (req, res, next) => {
  User.findOne({username:req.user.username}, (err,data) =>
  {
    data.stocks = [];
    data.stocks = req.body.stocks;
    data.save();
    res.status(200).send({message:"Save Complete"});
  })
});

module.exports = router;