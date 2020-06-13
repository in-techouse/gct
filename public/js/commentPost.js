const postCommentUser = JSON.parse(localStorage.getItem("user"));

function showPostMyComment(postId) {
  console.log("Comment Post id: ", postId);
  let display = $(".postComments" + postId).css("display");
  console.log("Display: ", display);
  if (display === "none") {
    $(".postComments" + postId).show(300);
    $(".postMoreComments" + postId).show(300);
    $(".postMyComment" + postId).show(300);
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
      appendComment(comment, postId);
    }
  });
}

function appendComment(comment, postId) {
  let commentHtml = `
    <li class="comment-item">
      <div class="post__author author vcard inline-items">
        <img src="${comment.userImg}" alt="author">

        <div class="author-date">
          <a class="h6 post__author-name fn" href="02-ProfilePage.html">${
            comment.userName
          }</a>
          <div class="post__date">
            <time class="published" datetime="2004-07-24T18:18">
              ${getTimeDifference(comment.timeStamps)}
            </time>
          </div>
        </div>

        <a href="javascript:;" class="more"><svg class="olymp-three-dots-icon">
            <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-three-dots-icon">
            </use>
          </svg></a>

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
