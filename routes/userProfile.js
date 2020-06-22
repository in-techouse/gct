var express = require("express");
var router = express.Router();

// Show user setting
router.get("/profilesettings", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  }
  let user = req.session.user;
  res.render("pages/user/userProfile/profilesettings", {
    user: user,
    action: "ProfileSettings",
  });
});

// Show user profile
router.get("/profile", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  }
  let user = req.session.user;
  res.render("pages/user/userProfile/profile", {
    user: user,
    action: "Profile",
  });
});

// Show user profile about
router.get("/profileabout", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  }
  let user = req.session.user;
  res.render("pages/user/userProfile/profileabout", {
    user: user,
    action: "ProfileAbout",
  });
});

// Show user friends
router.get("/friends", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  }
  let user = req.session.user;
  res.render("pages/user/userProfile/friends", {
    user: user,
    action: "Friends",
  });
});

// Show user photos
router.get("/photos", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  }
  let user = req.session.user;
  res.render("pages/user/userProfile/photos", { user: user, action: "Photos" });
});

// Show user videos
router.get("/videos", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  }
  let user = req.session.user;
  res.render("pages/user/userProfile/videos", { user: user, action: "Videos" });
});

module.exports = router;
