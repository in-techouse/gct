const allPosts = [];
const newsFeedFriends = [];
const newFeedUser = JSON.parse(localStorage.getItem("user"));
let userImg = "";
function gettweets() {
  $.ajax({
    url: "/user/tweets",
    type: "GET",
    success: function (data) {
      if (data !== "-1") {
        if (data.r.statusCode === 200) {
          let tweets = data.t;
          console.log("Tweets: ", tweets);
          tweets.forEach((tweet) => {
            let momentFormat = moment(tweet.created_at).format();
            let timeStamps = moment(momentFormat).format("X");
            timeStamps = parseInt(timeStamps);
            let isTweet = true;
            tweet = { ...tweet, timeStamps, isTweet };
            allPosts.push(tweet);
          });
        }
      }
      // getFriends();
      // getMyPosts();
    },
    error: function (error) {
      console.log("Error:", error);
      // getFriends();
      // getMyPosts();
    },
  });
}

function getMyPosts() {
  console.log("Call on get my posts");
  $.ajax({
    url: "/user/myPosts",
    type: "GET",
    success: function (data) {
      console.log("My post success: ", data);
      if (data != "-1") {
        data.forEach((d) => {
          allPosts.push(d);
        });
        // displayAllPosts();
      }
      // else {
      //   // displayAllPosts();
      // }
    },
    error: function (error) {
      console.log("Error:", error);
    },
  });
}

function getFriends() {
  firebase
    .database()
    .ref()
    .child("FriendsIds")
    .child(newFeedUser.id)
    .once("value")
    .then((friends) => {
      friends.forEach((friend) => {
        newsFeedFriends.push(friend.val());
      });
      // console.log("News Feed friends are: ", newsFeedFriends);
      loadFriendsPost(0);
    })
    .catch((e) => {
      console.log("Friend from database Error: ", e.message);
      loadFriendsPost(0);
    });
}

function loadFriendsPost(index) {
  if (newsFeedFriends.length === index) {
    console.log("All Posts are: ", allPosts);
    displayAllPosts();
    return;
  }
  // console.log("Friend id: ", newsFeedFriends[index]);
  // newsFeedFriends.forEach((friend) => {
  //   console.log("Friend Id: ", friend);
  firebase
    .database()
    .ref()
    .child("Posts")
    .orderByChild("twitterId")
    .equalTo(newsFeedFriends[index])
    .once("value")
    .then((posts) => {
      if (posts.exists) {
        posts.forEach((post) => {
          allPosts.push(post.val());
        });
      }
      loadFriendsPost(index + 1);
    })
    .catch((e) => {
      loadFriendsPost(index + 1);
    });
  // });
  // console.log("All Posts are: ", allPosts);
}

function displayAllPosts() {
  allPosts.sort(function (x, y) {
    return x.timeStamps - y.timeStamps;
  });
  console.log("My all post: ", allPosts);
  $("#loadingPosts").hide(300);

  allPosts.forEach((post) => {
    let postHtml = "";
    if (post.isTweet) {
      let tweetMedia = "";
      let link = "";
      let postText = "";
      if (post.text.includes("https://")) {
        link = post.text.substring(post.text.indexOf("https://"));
        postText =
          post.text.substring(0, post.text.indexOf("https://")) +
          `<a href="${link}" target="_blank">${link}</a>`;
      } else {
        postText = post.text;
      }
      if (post.extended_entities) {
        tweetMedia = `
		<div class="post-thumb">
      <img src="${post.extended_entities.media[0].media_url_https}"/>
      <a href="${post.extended_entities.media[0].expanded_url}" target="_blank">READ MORE</a>
		</div>`;
      }
      postHtml = `
                <div class="ui-block">
    			<article class="hentry post has-post-thumbnail shared-photo">
    				<div class="post__author author vcard inline-items">
    					<img src="${post.user.profile_image_url}" alt="author">
    					<div class="author-date">
    						<a class="h6 post__author-name fn" href="https://twitter.com/${
                  post.user.screen_name
                }" target="_blank">${post.user.name}</a> ${post.user.location}
    						<div class="post__date">
    							<time class="published" datetime="2004-07-24T18:18">
    								${getTimeDifference(post.timeStamps)}
    							</time>
    						</div>
    					</div>
    				</div>
                    <p>${postText}</p>
                    ${tweetMedia}    				
    			</article>
      </div>`;
      $("#newsfeed-items-grid").prepend(postHtml);
    } else {
      appendPostToUserTimeline(post);
    }
  });
}

$(document).ready(function () {
  // console.log("Newsfeed document is ready with user: ", newFeedUser);
  userImg = $("#userImg").val();
  gettweets();
  getMyPosts();
  getFriends();

  $(".showPostMyComment").click(function () {
    console.log("Clicked");
    let display = $(".postComments").css("display");
    console.log("Display: ", display);
    if (display === "none") {
      $(".postComments").show(300);
      $(".postMoreComments").show(300);
      $(".postMyComment").show(300);
    } else {
      $(".postComments").hide(300);
      $(".postMoreComments").hide(300);
      $(".postMyComment").hide(300);
    }
  });
});
