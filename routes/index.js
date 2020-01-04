var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('pages/index');
});
router.get('/login', function(req, res) {
  res.render('pages/auth/login');
});

router.get('/register', function(req, res) {
   res.render('pages/auth/register');	
});

module.exports = router;
