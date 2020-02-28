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

router.get("/user", function(req, res) {
  firebase
    .database()
    .ref()
    .child("Users")
    .child("PEIMndySWkdAuPD6IRbP1MIIpJ02")
    .once("value")
    .then(r => {
      if (r.val() == null || r.val() == undefined) {
        res.json("-1");
      } else {
        res.json("1");
      }
    })
    .catch(e => {
      res.json(e);
    });
  // if (req.session.isLoggedIn == true) {
  //   res.redirect("/user/newsfeed");
  // } else {
  //   res.render("pages/index");
  // }
});

/* GET home page. */
router.get("/", function(req, res) {
  if (req.session.isLoggedIn == true) {
    res.redirect("/user/newsfeed");
  } else {
    res.render("pages/index");
  }
});
router.post("/username", function(req, res) {
  let id = firebase.auth().currentUser.uid;
  let img = firebase.auth().currentUser.photoURL;
  let user = {
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    image: img,
    id: id
  };
  firebase
    .database()
    .ref()
    .child("Users")
    .child(user.id)
    .set(user)
    .then(r => {
      req.session.firstName = user.firstName;
      req.session.lastName = user.lastName;
      req.session.img = user.img;
      req.session.userId = id;
      req.session.isLoggedIn = true;
      res.redirect("/user/newsfeed");
    })
    .catch(e => {
      res.render("pages/index");
    });
});

router.post("/facebookLogin", function(req, res) {
  var credential = firebase.auth.FacebookAuthProvider.credential(
    req.body.accessToken
  );
  req.session.facebookAccessToken = req.body.accessToken;
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
        res.json(e.message);
      });
  } else {
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(result => {
        // Check user record in database
        firebase
          .database()
          .ref()
          .child("Users")
          .child(firebase.auth().currentUser.uid)
          .once("value")
          .then(r => {
            if (r.val() == null || r.val() == undefined) {
              req.session.facebook = true;
              res.json("1");
            } else {
              req.session.isLoggedIn = true;
              req.session.firstName = r.val().firstName;
              req.session.lastName = r.val().lastName;
              req.session.img = r.val().image;
              req.session.userId = r.val().id;
              res.json("3");
            }
          })
          .catch(e => {
            req.session.facebook = true;
            res.json("1");
          });
      })
      .catch(e => {
        res.json(e.message);
      });
  }
});

router.post("/twitterLogin", function(req, res) {
  var credential = firebase.auth.TwitterAuthProvider.credential(
    req.body.accessToken,
    req.body.secret
  );
  req.session.twitterAccessToken = req.body.accessToken;
  req.session.twitterSecret = req.body.secret;
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
        res.json(e.message);
      });
  } else {
    firebase
      .auth()
      .signInWithCredential(credential)
      .then(result => {
        // Check user record in database
        firebase
          .database()
          .ref()
          .child("Users")
          .child(firebase.auth().currentUser.uid)
          .once("value")
          .then(r => {
            if (r.val() == null || r.val() == undefined) {
              req.session.twitter = true;
              res.json("1");
            } else {
              req.session.isLoggedIn = true;
              req.session.firstName = r.val().firstName;
              req.session.lastName = r.val().lastName;
              req.session.img = r.val().image;
              req.session.userId = r.val().id;
              res.json("3");
            }
          })
          .catch(e => {
            req.session.twitter = true;
            res.json("1");
          });
      })
      .catch(e => {
        res.json(e.message);
      });
  }
});

module.exports = router;
