const allPosts = [];
function gettweets() {
  $.ajax({
    url: "/user/tweets",
    type: "GET",
    success: function (data) {
      if (data !== "-1") {
        if (data.r.statusCode !== 200) {
          return;
        } else {
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
        getMyPosts();
      }
      //   else {
      //     window.location.reload();
      //   }
    },
    error: function (error) {
      console.log("Error:", error);
      getMyPosts();
    },
  });
}

function getMyPosts() {
  $.ajax({
    url: "/user/myPosts",
    type: "GET",
    success: function (data) {
      if (data != "-1") {
        data.forEach((d) => {
          allPosts.push(d);
        });
        displayAllPosts();
      } else {
        displayAllPosts();
      }
    },
    error: function (error) {
      console.log("Error:", error);
    },
  });
}

function getTimeDifference(timeStamps) {
  let current = moment();
  let postTime = moment.unix(timeStamps);
  let hours = current.diff(postTime, "hours", true);
  let minutes = current.diff(postTime, "minutes", true);
  let formattedTime = "";
  if (hours < 23) {
    if (hours >= 1) {
      let finalHour = Math.round(hours);
      formattedTime = "" + finalHour + " hours ago";
    } else {
      let finalMinutes = Math.round(minutes);
      formattedTime = finalMinutes + " minutes ago";
    }
  } else {
    formattedTime = moment(postTime).format("ddd, Do, MMM-YYYY hh:mm A");
  }
  return formattedTime;
}

function displayAllPosts() {
  allPosts.sort(function (x, y) {
    return x.timeStamps - y.timeStamps;
  });

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
		<div class="post-video">
			<div class="video-thumb">
				<img src="${post.extended_entities.media[0].media_url_https}"/>
				<a href="${post.extended_entities.media[0].expanded_url}" target="_blank">READ MORE</a>
			</div>
		</div>`;
      }
      postHtml = `
                <div class="ui-block">
    			<article class="hentry post video">
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
    } else {
      let tweetMedia = "";
      if (post.url !== null && post.url !== undefined && post.url.length > 1) {
        tweetMedia = `
			<div class="post-video">
				<div class="video-thumb">
					<img src="${post.url}"/>
				</div>
			</div>`;
      }
      postHtml = `
	  <div class="ui-block">
		<article class="hentry post video">
			<div class="post__author author vcard inline-items">
				<img src="${post.userImg}" alt="author">
				<div class="author-date">
					<a class="h6 post__author-name fn" href="javascript:;" target="_blank">${
            post.userName
          }</a>
					<div class="post__date">
						<time class="published" datetime="2004-07-24T18:18">
							${getTimeDifference(post.timeStamps)}
						</time>
					</div>
				</div>
				<div class="more"><svg class="olymp-three-dots-icon">
						<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-three-dots-icon"></use>
					</svg>
					<ul class="more-dropdown">
						<li>
							<a href="javascript:;">Edit Post</a>
						</li>
						<li>
							<a href="javascript:;">Delete Post</a>
						</li>
					</ul>
				</div>
			</div>
			<p>${post.content}</p>
			${tweetMedia}
			<div class="post-additional-info inline-items">
				<a href="javascript:;" class="post-add-icon inline-items" id="likeHeart${
          post.id
        }" onclick="likePost('${post.id}')">
					<svg class="olymp-heart-icon">
						<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-heart-icon"></use>
					</svg>
					<span>18</span>
				</a>
				<ul class="friends-harmonic">
					<li>
						<a href="javascript:;">
							<img src="/public/img/friend-harmonic9.jpg" alt="friend">
						</a>
					</li>
					<li>
						<a href="javascript:;">
							<img src="/public/img/friend-harmonic10.jpg" alt="friend">
						</a>
					</li>
					<li>
						<a href="javascript:;">
							<img src="/public/img/friend-harmonic7.jpg" alt="friend">
						</a>
					</li>
					<li>
						<a href="javascript:;">
							<img src="/public/img/friend-harmonic8.jpg" alt="friend">
						</a>
					</li>
					<li>
						<a href="javascript:;">
							<img src="/public/img/friend-harmonic11.jpg" alt="friend">
						</a>
					</li>
				</ul>
				<div class="names-people-likes">
					<a href="javascript:;">Jenny</a>, <a href="javascript:;">Robert</a> and
					<br>18 more liked this
				</div>
				<div class="comments-shared">
					<a href="javascript:;" class="post-add-icon inline-items">
						<svg class="olymp-speech-balloon-icon">
							<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-speech-balloon-icon">
							</use>
						</svg>
						<span>0</span>
					</a>
				</div>
			</div>
			<div class="control-block-button post-control-button">
				<a href="javascript:;" class="btn btn-control" id="likeBtn${
          post.id
        }" onclick="likePost('${post.id}')">
					<svg class="olymp-like-post-icon">
						<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-like-post-icon"></use>
					</svg>
				</a>
				<a href="javascript:;" class="btn btn-control">
					<svg class="olymp-comments-post-icon">
						<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-comments-post-icon">
						</use>
					</svg>
				</a>
			</div>
		</article>
	</div>
		`;
    }
    $("#newsfeed-items-grid").prepend(postHtml);
  });
}

function likePost(postId) {
  console.log("Post id: ", postId);
  $("#likeBtn" + postId).css({
    backgroundColor: "#ff5e3a",
    color: "#FFFFFF",
  });
  $("#likeHeart" + postId).css({ color: "#ff5e3a" });
  $("#likeHeart" + postId + " .olymp-heart-icon").css({ color: "#ff5e3a" });
}

$(document).ready(function () {
  console.log("Newsfeed document is ready");
  gettweets();
});
