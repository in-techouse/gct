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
  measurementId: process.env.MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);

/* GET home page. */
router.get("/", function(req, res) {
  if (req.session.isLoggedIn == true) {
    res.redirect("/user/dashboard");
  } else {
    res.render("pages/index");
  }
});
router.post("/facebookLogin", function(req, res) {
  var credential = firebase.auth.FacebookAuthProvider.credential(
    req.body.accessToken
  );
  if (req.session.twitter == true) {
    firebase
      .auth()
      .currentUser.linkWithCredential(credential)
      .then(result => {
        req.session.facebook = true;
        req.session.isLoggedIn = true;
        res.json("2");
      })
      .catch(e => {
        res.json("-1");
      });
  } else {
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(result => {
        req.session.facebook = true;
        res.json("1");
      })
      .catch(e => {
        res.json("-1");
      });
  }
});

router.post("/twitterLogin", function(req, res) {
  var credential = firebase.auth.TwitterAuthProvider.credential(
    req.body.accessToken,
    req.body.secret
  );
  if (req.session.facebook == true) {
    firebase
      .auth()
      .currentUser.linkWithCredential(credential)
      .then(result => {
        req.session.twitter = true;
        req.session.isLoggedIn = true;
        res.json("2");
      })
      .catch(e => {
        res.json("-1");
      });
  } else {
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(result => {
        req.session.twitter = true;
        res.json("1");
      })
      .catch(e => {
        res.json("-1");
      });
  }
});

module.exports = router;
