const allPosts = [];
function gettweets() {
  $.ajax({
    url: "/user/tweets",
    type: "GET",

    success: function (data) {
      console.log("Success: ", data);
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
  console.log("Current Time: ", current);
  console.log("Post Time: ", postTime);
  let hours = current.diff(postTime, "hours", true);
  let minutes = current.diff(postTime, "minutes", true);
  console.log("Hours: ", hours);
  console.log("Minutes: ", minutes);
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
    					<div class="more"><svg class="olymp-three-dots-icon">
    							<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-three-dots-icon"></use>
    						</svg>
    						<ul class="more-dropdown">
    							<li>
    								<a href="#">Edit Post</a>
    							</li>
    							<li>
    								<a href="#">Delete Post</a>
    							</li>
    							<li>
    								<a href="#">Turn Off Notifications</a>
    							</li>
    							<li>
    								<a href="#">Select as Featured</a>
    							</li>
    						</ul>
    					</div>
    				</div>
                    <p>${post.text}</p>
                    ${tweetMedia}
    				<div class="post-additional-info inline-items">
    					<a href="#" class="post-add-icon inline-items">
    						<svg class="olymp-heart-icon">
    							<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-heart-icon"></use>
    						</svg>
    						<span>18</span>
    					</a>
    					<ul class="friends-harmonic">
    						<li>
    							<a href="#">
    								<img src="/public/img/friend-harmonic9.jpg" alt="friend">
    							</a>
    						</li>
    						<li>
    							<a href="#">
    								<img src="/public/img/friend-harmonic10.jpg" alt="friend">
    							</a>
    						</li>
    						<li>
    							<a href="#">
    								<img src="/public/img/friend-harmonic7.jpg" alt="friend">
    							</a>
    						</li>
    						<li>
    							<a href="#">
    								<img src="/public/img/friend-harmonic8.jpg" alt="friend">
    							</a>
    						</li>
    						<li>
    							<a href="#">
    								<img src="/public/img/friend-harmonic11.jpg" alt="friend">
    							</a>
    						</li>
    					</ul>
    					<div class="names-people-likes">
    						<a href="#">Jenny</a>, <a href="#">Robert</a> and
    						<br>18 more liked this
    					</div>
    					<div class="comments-shared">
    						<a href="#" class="post-add-icon inline-items">
    							<svg class="olymp-speech-balloon-icon">
    								<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-speech-balloon-icon">
    								</use>
    							</svg>
    							<span>0</span>
    						</a>
    						<a href="#" class="post-add-icon inline-items">
    							<svg class="olymp-share-icon">
    								<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-share-icon"></use>
    							</svg>
    							<span>16</span>
    						</a>
    					</div>
    				</div>
    				<div class="control-block-button post-control-button">
    					<a href="#" class="btn btn-control">
    						<svg class="olymp-like-post-icon">
    							<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-like-post-icon"></use>
    						</svg>
    					</a>
    					<a href="#" class="btn btn-control">
    						<svg class="olymp-comments-post-icon">
    							<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-comments-post-icon">
    							</use>
    						</svg>
    					</a>
    					<a href="#" class="btn btn-control">
    						<svg class="olymp-share-icon">
    							<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-share-icon"></use>
    						</svg>
    					</a>
    				</div>
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
					<a class="h6 post__author-name fn" href="#" target="_blank">${post.userName}</a>
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
							<a href="#">Edit Post</a>
						</li>
						<li>
							<a href="#">Delete Post</a>
						</li>
						<li>
							<a href="#">Turn Off Notifications</a>
						</li>
						<li>
							<a href="#">Select as Featured</a>
						</li>
					</ul>
				</div>
			</div>
			<p>${post.content}</p>
			${tweetMedia}
			<div class="post-additional-info inline-items">
				<a href="#" class="post-add-icon inline-items">
					<svg class="olymp-heart-icon">
						<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-heart-icon"></use>
					</svg>
					<span>18</span>
				</a>
				<ul class="friends-harmonic">
					<li>
						<a href="#">
							<img src="/public/img/friend-harmonic9.jpg" alt="friend">
						</a>
					</li>
					<li>
						<a href="#">
							<img src="/public/img/friend-harmonic10.jpg" alt="friend">
						</a>
					</li>
					<li>
						<a href="#">
							<img src="/public/img/friend-harmonic7.jpg" alt="friend">
						</a>
					</li>
					<li>
						<a href="#">
							<img src="/public/img/friend-harmonic8.jpg" alt="friend">
						</a>
					</li>
					<li>
						<a href="#">
							<img src="/public/img/friend-harmonic11.jpg" alt="friend">
						</a>
					</li>
				</ul>
				<div class="names-people-likes">
					<a href="#">Jenny</a>, <a href="#">Robert</a> and
					<br>18 more liked this
				</div>
				<div class="comments-shared">
					<a href="#" class="post-add-icon inline-items">
						<svg class="olymp-speech-balloon-icon">
							<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-speech-balloon-icon">
							</use>
						</svg>
						<span>0</span>
					</a>
					<a href="#" class="post-add-icon inline-items">
						<svg class="olymp-share-icon">
							<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-share-icon"></use>
						</svg>
						<span>16</span>
					</a>
				</div>
			</div>
			<div class="control-block-button post-control-button">
				<a href="#" class="btn btn-control">
					<svg class="olymp-like-post-icon">
						<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-like-post-icon"></use>
					</svg>
				</a>
				<a href="#" class="btn btn-control">
					<svg class="olymp-comments-post-icon">
						<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-comments-post-icon">
						</use>
					</svg>
				</a>
				<a href="#" class="btn btn-control">
					<svg class="olymp-share-icon">
						<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-share-icon"></use>
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

$(document).ready(function () {
  console.log("Newsfeed document is ready");
  getMyPosts();
  //   gettweets();
});
