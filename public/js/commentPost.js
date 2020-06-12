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
  });
}
