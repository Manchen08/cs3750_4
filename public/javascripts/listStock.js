var mongoose = require('mongoose');
var user = require('./models/user');
var io = require('socket');

user.findone({username:req.user.username}, function(err,user){
    console.log(user);
});


/*
router.post('/deleteStock', function(req, res, next) {
var stock = {
        fullname: req.body.fullname,
        stock: req.body.stock,
        percent: req.body.percent
    };

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('userSchema').find({fullname: stock.fullname, stock: stock.stock, percent: stock.percent}).count(function(error, result) {
            if (result != 0 && error == null) {
                db.collection('userSchema').deleteOne(fullname, stock, percent, function(err, result) {
                    assert.equal(null, err);
                    console.log('Stock Deleted');
                    db.close();
                });
            }
        });
    });
    res.redirect('/listStock');
});
*/

