const likeUser = JSON.parse(localStorage.getItem("user"));

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

function deleteLikeFromDatabase(postId) {
  firebase
    .database()
    .ref()
    .child("Likes")
    .orderByChild("postId")
    .equalTo(postId)
    .once("value")
    .then((likes) => {
      likes.forEach((like) => {
        if (like.val().userId === likeUser.id) {
          firebase
            .database()
            .ref()
            .child("Likes")
            .child(like.val().id)
            .remove();
        }
      });
    });
}

function likePost(postId) {
  const likeFieldValue = $(`#likeField-${postId}-${likeUser.id}`).val();
  console.log("Like Field Value is: ", likeFieldValue);
  if (likeFieldValue === "true" || likeFieldValue === true) {
    console.log("Unlike the post");
    $("#likeBtn" + postId).css({
      backgroundColor: "#9a9fbf",
      color: "#FFFFFF",
    });
    $("#likeHeart" + postId).css({ color: "#9a9fbf", fill: "#9a9fbf" });
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
        if (likes > 0) likes--;
        $("#likesCount" + postId).text(likes);
        firebase
          .database()
          .ref()
          .child("Posts")
          .child(postId)
          .child("likes")
          .set(likes);
        $(`#likeContent-${postId}-${likeUser.id}`).remove();
        $(`#likeNameContent-${postId}-${likeUser.id}`).remove();
        $(`#likeField-${postId}-${likeUser.id}`).remove();
        deleteLikeFromDatabase(postId);
      });
  } else {
    console.log("Like the post");
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
      <li id="likeContent-${postId}-${like.userId}">
          <a href="javascript:;">
              <img src="${like.userImg}" alt="friend">
          </a>
      </li>
    `;
  let likeNameContent = `
      <a href="javascript:;" id="likeNameContent-${postId}-${like.userId}">You</a>
    `;

  let likeField = `<input class="form-control" type="hidden" value="true" id="likeField-${postId}-${like.userId}"/>`;
  $("#friends-harmonic" + postId).append(likeContent);
  $("#names-people-likes" + postId).append(likeNameContent);
  $("#names-people-likes" + postId).append(likeField);
  $("#likeBtn" + postId).css({
    backgroundColor: "#ff5e3a",
    color: "#FFFFFF",
  });
  $("#likeHeart" + postId).css({ color: "#ff5e3a", fill: "#ff5e3a" });
}
