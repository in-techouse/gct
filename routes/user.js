var express = require("express");
var firebase = require("firebase");
var graph = require("fbgraph");
var Twitter = require("twitter");
var router = express.Router();

router.get("/newsfeed", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  }
  let user = req.session.user;
  res.render("pages/user/dashboard", { user: user, action: "News feed" });
});

router.post("/postOnSocialMedia", function (req, res) {
  let post = req.body.post;
  post = JSON.parse(post);
  graph.setAccessToken(req.session.user.facebook.accessToken);
  var wallPost = {
    message: "I'm gonna come at you like a spider monkey, chip!",
  };

  graph.post("/feed", wallPost, function (err, fbRes) {
    // returns the post id
    console.log(fbRes); // { id: xxxxx}
    res.json({ result: fbRes });
  });
});

router.get("/profile", function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session.user;
    res.render("pages/user/profile", { user: user, action: "Profile" });
  } else {
    res.redirect("/");
  }
});

router.get("/profilesettings", function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session.user;
    res.render("pages/user/profilesettings", {
      user: user,
      action: "Profile Settings",
    });
  } else {
    res.redirect("/");
  }
});

router.get("/profileabout", function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session.user;
    res.render("pages/user/profileabout", {
      user: user,
      action: "Profile About",
    });
  } else {
    res.redirect("/");
  }
});

router.get("/friends", function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session.user;
    res.render("pages/user/friends", { user: user, action: "Friends" });
  } else {
    res.redirect("/");
  }
});

router.get("/photos", function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session.user;
    res.render("pages/user/photos", { user: user, action: "Photos" });
  } else {
    res.redirect("/");
  }
});

router.get("/videos", function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session.user;
    res.render("pages/user/videos", { user: user, action: "Videos" });
  } else {
    res.redirect("/");
  }
});

// router.get("/fbgraph", function (req, res) {
//   graph.setAccessToken(req.session.facebookAccessToken);
//   graph.batch(
//     [
//       // {
//       //   method: "GET",
//       //   relative_url: "me" // Get the current user's profile information
//       // },
//       {
//         method: "GET",
//         relative_url: "me/friends", // Get the first 50 friends of the current user
//       },
//     ],
//     function (err, result) {
//       res.json({ error: err, result: result });
//     }
//   );
// });

router.get("/tweets", function (req, res) {
  if (req.session.isLoggedIn) {
    var client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: req.session.user.twitter.accessToken,
      access_token_secret: req.session.user.twitter.secret,
    });
    client.get("statuses/home_timeline", function (error, tweets, response) {
      res.json({ e: error, r: response, t: tweets });
    });
  } else {
    res.json("-1");
  }
});

router.get("/twitterProfile", function (req, res) {
  if (req.session.isLoggedIn) {
    var client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: req.session.user.twitter.accessToken,
      access_token_secret: req.session.user.twitter.secret,
    });
    console.log("twitter id: ", req.session.user.twitter.id);
    console.log("twitter screen name: ", req.session.user.twitter.screen_name);

    client.get(
      `users/show?user_id=${req.session.user.twitter.id}&&screen_name=${req.session.user.twitter.screen_name}`,
      function (error, tweets, response) {
        res.json({ e: error, r: response, t: tweets });
      }
    );
  } else {
    res.json("-1");
  }
});

router.get("/myPosts", function (req, res) {
  if (req.session.isLoggedIn) {
    let posts = [];
    let isTweet = false;
    firebase
      .database()
      .ref()
      .child("Posts")
      .orderByChild("userId")
      .equalTo(req.session.user.id)
      .once("value")
      .then((data) => {
        data.forEach((d) => {
          let post = d.val();
          post = { ...post, isTweet };
          posts.push(post);
        });
        res.json(posts);
      })
      .catch((err) => {
        res.json(posts);
      });
  } else {
    res.json("-1");
  }
});

router.get("/allchats", function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session.user;
    res.render("pages/user/allchats", {
      user: user,
      action: "All Chats/Messages",
    });
  } else {
    res.redirect("/");
  }
});

router.get("/allnotifications", function (req, res) {
  if (req.session.isLoggedIn) {
    let user = req.session.user;
    res.render("pages/user/allnotifications", {
      user: user,
      action: "All Notifications",
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
