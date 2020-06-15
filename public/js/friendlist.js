// function getfriendlist() {
//   $.ajax({
//     url: "/user/fbgraph",
//     type: "GET",
//     success: function (data) {
//       console.log("Success: ", data);
//     },
//     error: function (error) {
//       console.log("Error:", error);
//     },
//   });
// }
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
