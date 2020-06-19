const postCommentUser = JSON.parse(localStorage.getItem("user"));

function showPostMyComment(postId) {
  console.log("Comment Post id: ", postId);
  let display = $(".postComments" + postId).css("display");
  console.log("Display: ", display);
  if (display === "none") {
    $("#loadingComments" + postId).show(300);
    loadComments(postId);
  } else {
    $(".postComments" + postId).hide(300);
    $(".postMoreComments" + postId).hide(300);
    $(".postMyComment" + postId).hide(300);
  }

  $("#postMyComment" + postId).submit(function (e) {
    e.preventDefault();
    console.log("Post Comment Form is stopped");
    const postCommentContent = $.trim($("#postCommentContent" + postId).val());
    console.log("Post Comment Content is: ", postCommentContent);
    if (
      postCommentContent !== null &&
      postCommentContent !== undefined &&
      postCommentContent.length > 1
    ) {
      console.log("Post Comment Content is valid");

      let commentId = firebase.database().ref().child("Comments").push().key;
      let timeStamps = parseInt(moment().format("X"));
      let formattedTime = moment().format("ddd, Do, MMM-YYYY hh:mm A");
      let comment = {
        id: commentId,
        postId,
        userName: postCommentUser.firstName + " " + postCommentUser.lastName,
        userId: postCommentUser.id,
        userImg: postCommentUser.image,
        timeStamps,
        formattedTime,
        comment: postCommentContent,
        likes: 0,
      };
      firebase
        .database()
        .ref()
        .child("Comments")
        .child(comment.id)
        .set(comment);
      $("#postCommentContent" + postId).val("");
      appendComment(comment, postId);
      firebase
        .database()
        .ref()
        .child("Posts")
        .child(postId)
        .once("value")
        .then((r) => {
          let post = r.val();
          console.log("Post: ", post);
          let comments = post.comments;
          if (comments === undefined || comments === null) {
            comments = 0;
          }
          comments++;
          $("#commentsCount" + postId).text(comments);
          firebase
            .database()
            .ref()
            .child("Posts")
            .child(postId)
            .child("comments")
            .set(comments);
          sendCommentNotification(post);
        });
    }
  });
}

function appendComment(comment, postId) {
  let profileUrl = "";
  if (comment.userId === postCommentUser.id) {
    profileUrl = "/user/profile";
  } else {
    profileUrl = "/user/friendProfile?id=" + comment.userId;
  }
  let commentHtml = `
    <li class="comment-item">
      <div class="post__author author vcard inline-items">
        <img src="${comment.userImg}" alt="author">

        <div class="author-date">
          <a class="h6 post__author-name fn" href="${profileUrl}">
          ${comment.userName}
          </a>
          <div class="post__date">
            <time class="published" datetime="2004-07-24T18:18">
              ${getTimeDifference(comment.timeStamps)}
            </time>
          </div>
        </div>

        <a href="javascript:;" class="more">
          <svg class="olymp-three-dots-icon">
            <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-three-dots-icon">
            </use>
          </svg>
        </a>
      </div>

      <p>${comment.comment}</p>

      <a href="javascript:;" class="post-add-icon inline-items">
        <svg class="olymp-heart-icon">
          <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-heart-icon"></use>
        </svg>
        <span>${comment.likes}</span>
      </a>
    </li>
  `;
  $(".postComments" + postId).append(commentHtml);
  console.log("Comment Appended");
}

function loadComments(postId) {
  firebase
    .database()
    .ref()
    .child("Comments")
    .orderByChild("postId")
    .equalTo(postId)
    .once("value")
    .then((comments) => {
      $(".postComments" + postId).empty();
      comments.forEach((comment) => {
        console.log("Comment: ", comment.val());
        appendComment(comment.val(), postId);
      });
      $(".postComments" + postId).show(300);
      $(".postMoreComments" + postId).show(300);
      $(".postMyComment" + postId).show(300);
      $("#loadingComments" + postId).hide(300);
    })
    .catch((e) => {
      $(".postComments" + postId).show(300);
      $(".postMoreComments" + postId).show(300);
      $(".postMyComment" + postId).show(300);
      $("#loadingComments" + postId).hide(300);
    });
}

function sendCommentNotification(post) {
  let notificationId = firebase.database().ref().child("Notifications").push()
    .key;
  let timeStamps = parseInt(moment().format("X"));
  let formattedTime = moment().format("ddd, Do, MMM-YYYY hh:mm A");
  const notificatonText = " commented on your ";
  let notification = {
    id: notificationId,
    postId: post.id,
    userName: postCommentUser.firstName + " " + postCommentUser.lastName,
    userId: postCommentUser.id,
    userImg: postCommentUser.image,
    timeStamps,
    formattedTime,
    notificatonText,
    read: false,
    ownerId: post.userId,
  };
  firebase
    .database()
    .ref()
    .child("Notifications")
    .child(notification.id)
    .set(notification);
}
