var mongoose = require('mongoose');
var user = require('./models/user');
var io = require('socket');

user.findone({username:req.user.username}, function(err,user){
    console.log(user);
});




