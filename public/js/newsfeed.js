function gettweets() {
  $.ajax({
    url: "/user/tweets",
    type: "GET",

    success: function(data) {
      console.log("Success: ", data);
      if (data !== "-1") {
        console.log("Request Code: ", data.r);
        if (data.r.statusCode !== 200) {
          return;
        }
        console.log("Tweets: ", data.t);
        let tweets = data.t;
        tweets.forEach(tweet => {
          console.log("Tweet: ", tweet);
          let tweetMedia = "";
          if (tweet.extended_entities) {
            tweetMedia = `
                        <div class="post-video">
                            <img src="${tweet.extended_entities.media[0].media_url_https}"/>
                            <a href="${tweet.extended_entities.media[0].expanded_url}" target="_blank">READ MORE</a>
                        </div>`;
          }
          let tweetHTML = `
                    <div class="ui-block">

					<article class="hentry post video">

						<div class="post__author author vcard inline-items">
							<img src="${tweet.user.profile_image_url}" alt="author">

							<div class="author-date">
								<a class="h6 post__author-name fn" href="https://twitter.com/${tweet.user.screen_name}" target="_blank">${tweet.user.name}</a> ${tweet.user.location}
								<div class="post__date">
									<time class="published" datetime="2004-07-24T18:18">
										${tweet.created_at}
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

                        ${tweet.text}
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
          $("#newsfeed-items-grid").append(tweetHTML);
        });
      } else {
        window.location.reload();
      }
    },
    error: function(error) {
      console.log("Error:", error);
    }
  });
}

$(document).ready(function() {
  console.log("newsfeed document is ready");
  gettweets();
});
