var express = require('express');
var firebase = require('firebase');
var router = express.Router();


router.get('/newsfeed', function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session;
    res.render('pages/user/dashboard', { user: user, action: 'News feed'});
  }
  else {
    res.redirect("/");
  }
});

router.get('/profile', function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session;
    res.render('pages/user/profile', { user: user, action: 'Profile' });
  }
  else {
    res.redirect("/");
  }
});

router.get('/profilesettings', function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session;
    res.render('pages/user/profilesettings', { user: user, action: 'Profile Settings' });
  }
  else {
    res.redirect("/");
  }
});

router.get('/profileabout', function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session;
    res.render('pages/user/profileabout', { user: user, action: 'Profile About' });
  }
  else {
    res.redirect("/");
  }
});

router.get('/friends', function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session;
    res.render('pages/user/friends', { user: user, action: 'Friends' });
  }
  else {
    res.redirect("/");
  }
});
module.exports = router;