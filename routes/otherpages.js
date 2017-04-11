module.exports = () => {

    var express = require('express');
    var router = express.Router();
    console.log("here");
   //const ensureAuthenticated = require('../lib/auth').ensureAuthenticated;


    router.get('/management', (request, response, next) => {
        console.log("test");
        //console.log(ensureAuthenticated);
        //response.render("chatroom.jade", { username: request.session.myName, loggedIn: loggedin });
    });

    return router;
}
