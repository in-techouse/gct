$(document).ready(function () {
  const friendId = $("#friendId").val();
  console.log("Friend Id: ", friendId);
  getFriendsPosts(friendId);
  getFriendAllPhotos(friendId);
});

function getFriendAllPhotos(friendId) {
  firebase
    .database()
    .ref()
    .child("Photos")
    .child(friendId)
    .once("value")
    .then((data) => {
      data.forEach((p) => {
        showFriendLastPhotos(p.val());
      });
    });
}

function showFriendLastPhotos(photo) {
  const photoContent = `
    <li>
      <a href="${photo}">
        <img src="${photo}" alt="photo" style="width: 100%; height: 80px;">
      </a>
    </li>`;
  $("#friendLastPhotos").prepend(photoContent);
}

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
