var express = require('express');
var firebase = require('firebase');
var router = express.Router();


router.get('/newsfeed', function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session;
    res.render('pages/user/dashboard', { user: user });
  }
  else {
    res.redirect("/");
  }
});

router.get('/profile', function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session;
    res.render('pages/user/profile', { user: user });
  }
  else {
    res.redirect("/");
  }
});

router.get('/profilesettings', function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session;
    res.render('pages/user/profilesettings', { user: user });
  }
  else {
    res.redirect("/");
  }
});

router.get('/profileabout', function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session;
    res.render('pages/user/profileabout', { user: user });
  }
  else {
    res.redirect("/");
  }
});

module.exports = router;