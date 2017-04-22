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

    req.checkBody('txtName', 'A chosen stock is required').notEmpty();

    let errors = req.validationErrors();
    if(!errors){
      if(sym.length > 4){
        errors = "Error";
      }
    }
    if (errors) {
          req.flash('success_msg','A chosen stock is required.');
          res.redirect('/addStock');
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
router.get('/viewStock', ensureAuthenticated,(req, res, next) => {
  User.findOne({username:req.user.username}, (err,data) =>
  {
    res.render('viewStock', {title: 'Your Stocks', stocks: data.stocks})
    //res.status(200).send({stocks:data.stocks});
  })
});

router.get('/listStock', ensureAuthenticated,(req,res,next) => {

    res.render('listStock', {title: 'List Stocks', userr:req.user.username});

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
router.put('/userstocks', ensureAuthenticated,(req, res, next) => {
  User.findOne({username:req.user.username}, (err,data) =>
  {
    var r = req.body.stocks.map((e=> e.percent)).reduce(( v1,v2)=>Number(v1)+Number(v2),0)


    if(r <= 100)
    {
      //console.log(req.body.stocks.percent.reduce((v1,v2) => v1+v2,0));
      data.stocks = [];
      data.stocks = req.body.stocks;
      data.save();
      res.status(200).send({message:"Save Complete"});
    }
  })
});

router.delete('/userstocks', ensureAuthenticated,(req, res, next) => {

  User.findOne({username:req.user.username}, (err,data) =>
  {
    
    for(var i =0; i < data.stocks.length; i++)
    {
      if (data.stocks[i].stock === req.body.stock) {
          data.stocks.splice(i,1);
          break;
      }
    }

    data.save();
    res.status(200).send({message:"Deleted",user:data});

  })
});

module.exports = router;