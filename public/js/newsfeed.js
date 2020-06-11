const allPosts = [];
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
      getMyPosts();
    },
    error: function (error) {
      console.log("Error:", error);
      getMyPosts();
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
  console.log("My all post: ", allPosts);

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
    } else {
      let tweetMedia = "";
      if (post.url !== null && post.url !== undefined && post.url.length > 1) {
        tweetMedia = `
			<div class="post-thumb">
        <img src="${post.url}"/>
			</div>`;
      }
      postHtml = `
	  <div class="ui-block">
		<article class="hentry post has-post-thumbnail shared-photo">
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
					<span id="likesCount${post.id}">${post.likes}</span>
				</a>
				<ul class="friends-harmonic" id="friends-harmonic${post.id}">
				</ul>
				<div class="names-people-likes" id="names-people-likes${post.id}">
				</div>
				<div class="comments-shared">
					<a href="javascript:;" class="post-add-icon inline-items" onclick="showPostMyComment('${
            post.id
          }')">
						<svg class="olymp-speech-balloon-icon">
							<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-speech-balloon-icon">
							</use>
						</svg>
						<span>${post.comments}</span>
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
				<a href="javascript:;" class="btn btn-control" onclick="showPostMyComment('${
          post.id
        }')">
					<svg class="olymp-comments-post-icon">
						<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-comments-post-icon">
						</use>
					</svg>
				</a>
			</div>
    </article>
    <ul class="comments-list postComments${post.id}" style="display: none;">
      <li class="comment-item">
        <div class="post__author author vcard inline-items">
          <img src="/public/img/author-page.jpg" alt="author">

          <div class="author-date">
            <a class="h6 post__author-name fn" href="02-ProfilePage.html">James Spiegel</a>
            <div class="post__date">
              <time class="published" datetime="2004-07-24T18:18">
                38 mins ago
              </time>
            </div>
          </div>

          <a href="javascript:;" class="more"><svg class="olymp-three-dots-icon">
              <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-three-dots-icon">
              </use>
            </svg></a>

        </div>

        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium der doloremque
          laudantium.</p>

        <a href="javascript:;" class="post-add-icon inline-items">
          <svg class="olymp-heart-icon">
            <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-heart-icon"></use>
          </svg>
          <span>3</span>
        </a>
        <a href="javascript:;" class="reply">Reply</a>
      </li>
      <li class="comment-item">
        <div class="post__author author vcard inline-items">
          <img src="/public/img/avatar1-sm.jpg" alt="author">

          <div class="author-date">
            <a class="h6 post__author-name fn" href="javascript:;">Mathilda Brinker</a>
            <div class="post__date">
              <time class="published" datetime="2004-07-24T18:18">
                1 hour ago
              </time>
            </div>
          </div>

          <a href="javascript:;" class="more"><svg class="olymp-three-dots-icon">
              <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-three-dots-icon">
              </use>
            </svg></a>

        </div>

        <p>Ratione voluptatem sequi en lod nesciunt. Neque porro quisquam est, quinder dolorem ipsum
          quia dolor sit amet, consectetur adipisci velit en lorem ipsum duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum.
        </p>

        <a href="javascript:;" class="post-add-icon inline-items">
          <svg class="olymp-heart-icon">
            <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-heart-icon"></use>
          </svg>
          <span>8</span>
        </a>
        <a href="javascript:;" class="reply">Reply</a>
      </li>
    </ul>
    <a href="javascript:;" class="postMoreComments${
      post.id
    } more-comments" style="display: none;">View more comments <span>+</span></a>
    <form class="comment-form inline-items postMyComment${
      post.id
    }" style="display: none;">

      <div class="post__author author vcard inline-items">
        <img src="${userImg}" alt="author">

        <div class="form-group with-icon-right ">
          <textarea class="form-control" placeholder=""></textarea>
          <div class="add-options-message">
            <a href="javascript:;" class="options-message" data-toggle="modal"
              data-target="#update-header-photo">
              <svg class="olymp-camera-icon">
                <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-camera-icon">
                </use>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <button class="btn btn-md-2 btn-primary">Post Comment</button>

      <button onclick="showPostMyComment('${post.id}')"
        class="btn btn-md-2 btn-border-think c-grey btn-transparent custom-color">Cancel</button>

    </form>
	</div>
		`;
    }
    $("#newsfeed-items-grid").prepend(postHtml);
    getLikesForPost(post.id);
  });
}

$(document).ready(function () {
  console.log("Newsfeed document is ready");
  userImg = $("#userImg").val();
  gettweets();

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
