const activeFriendsUser = JSON.parse(localStorage.getItem("user"));
const friendsIds = [];
const friends = [];

$(document).ready(function () {
  console.log("Get Active Friends document is ready");
  getFriendsIds();
});

function getFriendsIds() {
  firebase
    .database()
    .ref()
    .child("FriendsIds")
    .child(activeFriendsUser.id)
    .once("value")
    .then((friends) => {
      friends.forEach((friend) => {
        friendsIds.push(friend.val());
      });
      getFriendProfile(0);
    })
    .catch((e) => {});
}

function getFriendProfile(index) {
  if (index >= friendsIds.length) {
    return;
  }
  firebase
    .database()
    .ref()
    .child("Users")
    .child(friendsIds[index])
    .once("value")
    .then((friend) => {
      friends.push(friend.val());
      $("#chatUsers").append(`
        <li class="inline-items js-chat-open" id="friendChat${friend.val().id}">
            <div class="author-thumb">
                <img alt="author" src="${
                  friend.val().image
                }" class="avatar" style="width: 40px;">
                <span class="icon-status online"></span>
            </div>
        </li>
      `);
      getFriendProfile(index + 1);
    })
    .catch((e) => {
      getFriendProfile(index + 1);
    });
}
