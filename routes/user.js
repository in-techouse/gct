var express = require('express');
var firebase = require('firebase');
var router = express.Router();


router.get('/newsfeed', function(req, res) {
  if(req.session.isLoggedIn){
    res.render('pages/user/dashboard');
  }
  else{
    res.redirect("/");
  }
});

router.get('/profile', function(req, res) {
  if(req.session.isLoggedIn){
    res.render('pages/user/profile');
  }
  else{
    res.redirect("/");
  }
});

module.exports = router;