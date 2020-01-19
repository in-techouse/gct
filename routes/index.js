var express = require('express');
var firebase = require('firebase');
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
router.get('/', function(req, res) {
  res.render('pages/index');
});
router.post('/facebookLogin', function(req, res) {
  res.json("1");
});

router.post('/twitterLogin', function(req, res) {
   	
});

module.exports = router;
