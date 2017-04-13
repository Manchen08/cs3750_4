var mongoose = require('mongoose');

var userInfo;

function retreiveUserInfo(req, res){
    userInfo = user.find(req.user.username)
}