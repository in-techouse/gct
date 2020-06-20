$(document).ready(function () {
  const friendId = $("#friendId").val();
  console.log("Friend Id: ", friendId);
  getFriendsPosts(friendId);
});

function getFriendsPosts(friendId) {
  console.log("Call on get friends posts");
  let posts = [];
  firebase
    .database()
    .ref()
    .child("Posts")
    .orderByChild("userId")
    .equalTo(friendId)
    .once("value")
    .then((data) => {
      data.forEach((p) => {
        posts.push(p.val());
      });
      displayAllFriendPosts(posts);
    })
    .catch((e) => {
      displayAllFriendPosts(posts);
    });
}

function displayAllFriendPosts(posts) {
  posts.sort(function (x, y) {
    return x.timeStamps - y.timeStamps;
  });
  console.log("My Friend post: ", posts);
  $("#loadingPosts").hide(300);
  posts.forEach((post) => {
    appendPostToUserTimeline(post);
  });
}
