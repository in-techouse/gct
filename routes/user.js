var express = require("express");
var firebase = require("firebase");
var graph = require("fbgraph");
var Twitter = require("twitter");
var router = express.Router();

// Show News Feed Page
router.get("/newsfeed", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  }
  let user = req.session.user;
  res.render("pages/user/dashboard", { user: user, action: "News feed" });
});

// Get all tweets from user timeline
router.get("/tweets", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.json("-1");
  }
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: req.session.user.twitter.accessToken,
    access_token_secret: req.session.user.twitter.secret,
  });
  client.get("statuses/home_timeline", function (error, tweets, response) {
    res.json({ e: error, r: response, t: tweets });
  });
});

// Get all users post
router.get("/myPosts", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.json("-1");
  }
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
});

// Post status on twitter
router.post("/postOnTwitter", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.json("-1");
  }
  let post = JSON.parse(req.body.post);
  let socialImageBase64 = req.body.socialImageBase64
    .toString()
    .replace(/\r?\n|\r/g, "");
  if (post.isTwitter) {
    var client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: req.session.user.twitter.accessToken,
      access_token_secret: req.session.user.twitter.secret,
    });
    if (post.isImage) {
      client.post("media/upload", { media_data: socialImageBase64 }, function (
        error,
        media,
        response
      ) {
        if (!error) {
          const mediaId = media.media_id_string;
          var status = {
            status: post.content,
            media_ids: media.media_id_string,
          };
          client.post("statuses/update", status, function (
            statusError,
            statusTweet,
            statusResponse
          ) {
            if (!statusError) {
              res.json({
                success: true,
                message: "Status updated on Twitter",
                tweet: statusTweet,
              });
            } else {
              res.json({
                success: false,
                message: "Staus not updated on twitter",
                error: statusError,
              });
            }
          });
        } else {
          res.json({
            success: false,
            message: "Twitter Upoad Image Error Occur",
            error: error,
          });
        }
      });
    } else {
      var status = {
        status: post.content,
      };
      client.post("statuses/update", status, function (
        statusError,
        statusTweet,
        statusResponse
      ) {
        if (!statusError) {
          res.json({
            success: true,
            message: "Status updated on Twitter",
            tweet: statusTweet,
          });
        } else {
          res.json({
            success: false,
            message: "Staus not updated on twitter",
            error: statusError,
          });
        }
      });
    }
  } else {
    res.json("-1");
  }
});

router.post("/postOnFacebook", function (req, res) {
  graph.setAccessToken(req.session.user.facebook.accessToken);
  graph.batch(
    [
      {
        method: "GET",
        relative_url: "me", // Get the current user's profile information
      },
      {
        method: "GET",
        relative_url: "me/friends?limit=50", // Get the first 50 friends of the current user
      },
    ],
    function (err, result) {
      res.json({ result: result, error: err });
      // [
      //   {
      //     "code": 200,
      //     "headers":[
      //       {"name": "Content-Type", "value": "text/javascript; charset=UTF-8"}
      //     ],
      //     "body": "{\"id\":\"…\"}"
      //   },
      //   {
      //     "code": 200,
      //     "headers":[
      //       {"name": "Content-Type", "value": "text/javascript; charset=UTF-8"}
      //     ],
      //     "body":"{\"data\": [{…}]}"
      //   }
      // ]
    }
  );
  // let post = JSON.parse(req.body.post);
  // graph.setAccessToken(req.session.user.facebook.accessToken);
  // var wallPost = {
  //   message: "I'm gonna come at you like a spider monkey, chip!",
  // };

  // graph.post("/feed", wallPost, function (err, result) {
  //   res.json({ post: post, graph: graph, error: err, result: result });
  // });
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

router.get("/allnotifications", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  }
  let user = req.session.user;
  let notificationsArray = [];
  firebase
    .database()
    .ref()
    .child("Notifications")
    .orderByChild("ownerId")
    .equalTo(user.id)
    .once("value")
    .then((notifications) => {
      notifications.forEach((n) => {
        notificationsArray.push(n.val());
      });
      notificationsArray.reverse();
      res.render("pages/user/allnotifications", {
        user: user,
        action: "All Notifications",
        notifications: notificationsArray,
      });
    })
    .catch((err) => {
      res.render("pages/user/allnotifications", {
        user: user,
        action: "All Notifications",
        notifications: notificationsArray,
      });
    });
});

router.get("/allchats", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  }
  let user = req.session.user;
  res.render("pages/user/allchats", {
    user: user,
    action: "All Chats/Messages",
  });
});

router.get("/showPost", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  }
  if (!req.query.id) {
    res.redirect("/user/newsfeed");
  }
  firebase
    .database()
    .ref()
    .child("Posts")
    .child(req.query.id)
    .once("value")
    .then((post) => {
      if (post.val() === undefined || post.val() === null) {
        res.redirect("/user/newsfeed");
      }
      res.render("pages/user/showPost", {
        user: req.session.user,
        post: post.val(),
        action: "ShowPost",
      });
    })
    .catch((e) => {
      res.redirect("/user/newsfeed");
    });
});

router.get("/editPost", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  }
  if (!req.query.id) {
    res.redirect("/user/newsfeed");
  }
  firebase
    .database()
    .ref()
    .child("Posts")
    .child(req.query.id)
    .once("value")
    .then((post) => {
      if (post.val() === undefined || post.val() === null) {
        res.redirect("/user/newsfeed");
      }
      res.render("pages/user/editPost", {
        user: req.session.user,
        post: post.val(),
        action: "EditPost",
      });
    })
    .catch((e) => {
      res.redirect("/user/newsfeed");
    });
});

router.post("/editPost", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.redirect("/");
  }
  let updatePost = {
    id: req.body.postId,
    content: req.body.userContent,
    isImage: req.body.isImage === "true" ? true : false,
    url: req.body.url,
  };
  firebase
    .database()
    .ref()
    .child("Posts")
    .child(updatePost.id)
    .once("value")
    .then((p) => {
      if (p.val() === undefined || p.val() === null) {
        res.redirect("/user/newsfeed");
      }
      let post = p.val();
      post.isImage = updatePost.isImage;
      post.url = updatePost.url;
      post.content = updatePost.content;
      firebase
        .database()
        .ref()
        .child("Posts")
        .child(post.id)
        .set(post)
        .then((r) => {
          res.redirect("/user/newsfeed");
        });
    })
    .catch((e) => {
      res.redirect("/user/newsfeed");
    });
});

router.get("/getTwitterFriends", function (req, res) {
  if (!req.session.isLoggedIn) {
    res.json("-1");
  }
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: req.session.user.twitter.accessToken,
    access_token_secret: req.session.user.twitter.secret,
  });
  client.get("friends/list", { count: 200 }, function (
    error,
    tweets,
    response
  ) {
    if (error) {
      res.json("-1");
    }
    res.json({ friends: tweets.users });
  });
});

module.exports = router;
