const allPosts = [];
let userImg = "";
$(document).ready(function () {
  console.log("My Timeline Document is ready");
  let user = JSON.parse(localStorage.getItem("user"));
  userImg = user.image;
  getMyPosts();
});

function getMyPosts() {
  console.log("Call on get my posts");
  $.ajax({
    url: "/user/myPosts",
    type: "GET",
    success: function (data) {
      console.log("My post success: ", data);
      if (data != "-1") {
        data.forEach((d) => {
          allPosts.push(d);
        });
        displayAllPosts();
      } else {
        displayAllPosts();
      }
    },
    error: function (error) {
      console.log("Error:", error);
    },
  });
}

function displayAllPosts() {
  allPosts.sort(function (x, y) {
    return x.timeStamps - y.timeStamps;
  });
  console.log("My all post: ", allPosts);

  allPosts.forEach((post) => {
    appendPostToUserTimeline(post);
  });
}
