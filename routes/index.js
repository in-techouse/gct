var express = require("express");
var firebase = require("firebase");
var router = express.Router();

var firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);

/* GET home page. */
router.get("/", function (req, res) {
  if (req.session.isLoggedIn == true) {
    res.redirect("/user/newsfeed");
  } else {
    res.render("pages/index");
  }
});

router.post("/userSession", function (req, res) {
  let user = req.body.user;
  user = JSON.parse(user);
  req.session.user = user;
  req.session.isLoggedIn = true;
  res.json("1");
});

router.get("/logout", function (req, res) {
  firebase.auth().signOut();
  req.session.destroy(function (err) {
    if (err) {
      res.negotiate(err);
    }
    res.redirect("/");
  });
});

router.get("/privacy", function (req, res) {
  res.render("pages/policy");
});

router.get("/terms", function (req, res) {
  res.render("pages/terms");
});

module.exports = router;
