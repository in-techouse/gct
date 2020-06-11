function getLikesForPost(postId) {
  firebase
    .database()
    .ref()
    .child("Likes")
    .orderByChild("postId")
    .equalTo(postId)
    .once("value")
    .then((data) => {
      data.forEach((d) => {
        appendLikeOnPost(postId, d.val());
      });
    });
}

function likePost(postId) {
  console.log("Like Post id: ", postId);
  $("#likeBtn" + postId).css({
    backgroundColor: "#ff5e3a",
    color: "#FFFFFF",
  });
  $("#likeHeart" + postId).css({ color: "#ff5e3a", fill: "#ff5e3a" });
  firebase
    .database()
    .ref()
    .child("Posts")
    .child(postId)
    .once("value")
    .then((r) => {
      let post = r.val();
      console.log("Post: ", post);
      let likes = post.likes;
      if (likes === undefined || likes === null) {
        likes = 0;
      }
      likes++;
      $("#likesCount" + postId).text(likes);
      firebase
        .database()
        .ref()
        .child("Posts")
        .child(postId)
        .child("likes")
        .set(likes);

      appendLike(postId);
    });
}

function appendLike(postId) {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("User is: ", user);
  console.log("Post Id is: ", postId);
  let likeId = firebase.database().ref().child("Likes").push().key;
  let timeStamps = parseInt(moment().format("X"));
  let formattedTime = moment().format("ddd, Do, MMM-YYYY hh:mm A");
  let like = {
    id: likeId,
    postId,
    userName: user.firstName + " " + user.lastName,
    userId: user.id,
    userImg: user.image,
    timeStamps,
    formattedTime,
  };
  firebase.database().ref().child("Likes").child(like.id).set(like);
  appendLikeOnPost(postId, like);
}

function appendLikeOnPost(postId, like) {
  let likeContent = `
      <li>
          <a href="javascript:;">
              <img src="${like.userImg}" alt="friend">
          </a>
      </li>
    `;
  let likeNameContent = `
      <a href="javascript:;">You</a>
    `;
  $("#friends-harmonic" + postId).append(likeContent);
  $("#names-people-likes" + postId).append(likeNameContent);
  $("#likeBtn" + postId).css({
    backgroundColor: "#ff5e3a",
    color: "#FFFFFF",
  });
  $("#likeHeart" + postId).css({ color: "#ff5e3a", fill: "#ff5e3a" });
}
