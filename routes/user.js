var express = require('express');
var firebase = require('firebase');
var router = express.Router();


router.get('/newsfeed', function(req, res) {
  res.render('pages/user/dashboard');
});

router.get('/profile', function(req, res) {
  res.render('pages/user/profile');
});

module.exports = router;