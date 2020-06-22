var express = require("express");
var firebase = require("firebase");
var router = express.Router();

// Show Friend's Timeline
router.get("/friendProfile", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  }
  firebase
    .database()
    .ref()
    .child("Users")
    .child(req.query.id)
    .once("value")
    .then((friend) => {
      res.render("pages/user/userFriend/friendProfile", {
        user: req.session.user,
        friend: friend.val(),
        action: "friendProfile",
      });
    })
    .catch((e) => {
      res.redirect("/");
    });
});

// Show Friend's of Friend
router.get("/friendsOfFriend", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  }
  firebase
    .database()
    .ref()
    .child("Users")
    .child(req.query.id)
    .once("value")
    .then((friend) => {
      res.render("pages/user/userFriend/friendsOfFriends", {
        user: req.session.user,
        friend: friend.val(),
        action: "friendsOfFriend",
      });
    })
    .catch((e) => {
      res.redirect("/");
    });
});

// Show Friend's About
router.get("/friendProfileAbout", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  }
  firebase
    .database()
    .ref()
    .child("Users")
    .child(req.query.id)
    .once("value")
    .then((friend) => {
      res.render("pages/user/userFriend/friendProfileAbout", {
        user: req.session.user,
        friend: friend.val(),
        action: "friendProfileAbout",
      });
    })
    .catch((e) => {
      res.redirect("/");
    });
});

// Show Friend's Videos
router.get("/friendVideos", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  }
  firebase
    .database()
    .ref()
    .child("Users")
    .child(req.query.id)
    .once("value")
    .then((friend) => {
      res.render("pages/user/userFriend/friendVideos", {
        user: req.session.user,
        friend: friend.val(),
        action: "friendPVideos",
      });
    })
    .catch((e) => {
      res.redirect("/");
    });
});

// Show Friend's Photos
router.get("/friendPhotos", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  }
  firebase
    .database()
    .ref()
    .child("Users")
    .child(req.query.id)
    .once("value")
    .then((friend) => {
      res.render("pages/user/userFriend/friendPhotos", {
        user: req.session.user,
        friend: friend.val(),
        action: "friendPhotos",
      });
    })
    .catch((e) => {
      res.redirect("/");
    });
});

module.exports = router;
