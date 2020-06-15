const friendUser = JSON.parse(localStorage.getItem("user"));
$(document).ready(function () {
  console.log("Friend List document is ready");
  getTwitterFriendList();
});

function getTwitterFriendList() {
  $.ajax({
    type: "GET",
    url: "/user/getTwitterFriends",
    success: function (result) {
      console.log("Twitter Friends Success: ", result);
      if (result !== "-1") {
        let userFriends = [];
        const friends = result.friends;
        friends.forEach((friend) => {
          friend = { ...friend, ...{ userId: friendUser.id } };
          userFriends.push(friend);
        });
        saveFriendToDatabase(userFriends);
        showOnFriendPage(userFriends);
      }
    },
    error: function (err) {
      console.log("Twitter Friends Failure: ", err);
    },
  });
}

function saveFriendToDatabase(userFriends) {
  firebase
    .database()
    .ref()
    .child("Friends")
    .child(friendUser.id)
    .set(userFriends);
}

function showOnFriendPage(userFriends) {
  $("#userFriendCount").text(
    friendUser.firstName + "'s Friends (" + userFriends.length + ")"
  );
  $("#loadingFriends").hide(300);
  userFriends.forEach((friend) => {
    let userFriendContent = `
      <div class="col col-xl-3 col-lg-6 col-md-6 col-sm-6 col-12">
        <div class="ui-block">

            <div class="friend-item">
                <div class="friend-header-thumb">
                    <img src="${friend.profile_background_image_url_https}" alt="friend" style="width: 100%; height: 118px;">
                </div>

                <div class="friend-item-content">

                    <div class="more">
                        <svg class="olymp-three-dots-icon">
                            <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-three-dots-icon"></use>
                        </svg>
                        <ul class="more-dropdown">
                            <li>
                                <a href="#">Report Profile</a>
                            </li>
                            <li>
                                <a href="#">Block Profile</a>
                            </li>
                            <li>
                                <a href="#">Turn Off Notifications</a>
                            </li>
                        </ul>
                    </div>
                    <div class="friend-avatar">
                        <div class="author-thumb">
                            <img src="${friend.profile_image_url_https}" alt="author" style="widht: 98px; height: 98px;">
                        </div>
                        <div class="author-content">
                            <a href="#" class="h5 author-name">${friend.name}</a>
                            <div class="country">${friend.location}</div>
                        </div>
                    </div>

                    <div class="swiper-container" data-slide="fade">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide">
                                <div class="friend-count" data-swiper-parallax="-500">
                                    <a href="#" class="friend-count-item">
                                        <div class="h6">${friend.friends_count}</div>
                                        <div class="title">Friends</div>
                                    </a>
                                    <a href="#" class="friend-count-item">
                                        <div class="h6">${friend.statuses_count}</div>
                                        <div class="title">Status</div>
                                    </a>
                                    <a href="#" class="friend-count-item">
                                        <div class="h6">${friend.followers_count}</div>
                                        <div class="title">Followers</div>
                                    </a>
                                </div>
                                <div class="control-block-button" data-swiper-parallax="-100">
                                    <a href="#" class="btn btn-control bg-blue">
                                        <svg class="olymp-happy-face-icon">
                                            <use
                                                xlink:href="/public/svg-icons/sprites/icons.svg#olymp-happy-face-icon">
                                            </use>
                                        </svg>
                                    </a>

                                    <a href="#" class="btn btn-control bg-purple">
                                        <svg class="olymp-chat---messages-icon">
                                            <use
                                                xlink:href="/public/svg-icons/sprites/icons.svg#olymp-chat---messages-icon">
                                            </use>
                                        </svg>
                                    </a>

                                </div>
                            </div>

                            <div class="swiper-slide">
                                <p class="friend-about" data-swiper-parallax="-500">
                                ${friend.description}
                                </p>

                                <div class="friend-since" data-swiper-parallax="-100">
                                    <span>Member Since:</span>
                                    <div class="h6">${friend.created_at}</div>
                                </div>
                            </div>
                        </div>
                        <div class="swiper-pagination"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    `;
    $("#userFriendList").append(userFriendContent);
  });
}
