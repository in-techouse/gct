var express = require('express');
var firebase = require('firebase');
var graph = require('fbgraph');
var Twitter = require('twitter');
var router = express.Router();


router.get('/newsfeed', function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session;
    res.render('pages/user/dashboard', { user: user, action: 'News feed' });
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

router.get('/photos', function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session;
    res.render('pages/user/photos', { user: user, action: 'Photos' });
  }
  else {
    res.redirect("/");
  }
});

router.get('/videos', function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session;
    res.render('pages/user/videos', { user: user, action: 'Videos' });
  }
  else {
    res.redirect("/");
  }
});



router.get('/fbgraph', function (req, res) {
  res.json("1")
  // if () {

  // }
  // else {

  // }
});

router.get('/logout', function (req, res) {
  firebase.auth().signOut();
  req.session.destroy(function (err) {
    if (err) {
      res.negotiate(err);
    }
    res.redirect("/");

  });

});

router.get('/tweets', function (req, res) {
  if (req.session.isLoggedIn) {
    var client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: req.session.twitterAccessToken,
      access_token_secret: req.session.twitterSecret,
    });
    client.get('statuses/home_timeline', function (error, tweets, response) {
      res.json({ e: error, r: response, t: tweets });
    });
  }
  else {
    res.json("-1");
  }
});

module.exports = router;