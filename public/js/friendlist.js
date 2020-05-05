function getfriendlist() {
  $.ajax({
    url: "/user/fbgraph",
    type: "GET",
    success: function (data) {
      console.log("Success: ", data);
    },
    error: function (error) {
      console.log("Error:", error);
    },
  });
}
$(document).ready(function () {
  console.log("Friend List document is ready");
  getfriendlist();
});
