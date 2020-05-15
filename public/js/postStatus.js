$(document).ready(function () {
  console.log("Post Status Document is ready");

  $("#photoUploadIcon").click(function () {
    $("#photoUpload").trigger("click");
  });

  $("#postStatus").submit(function (event) {
    event.preventDefault();
    console.log("Form is stopped.");
    let userContent = $("#userContent").val();
    console.log("Content: ", userContent);
    // Ajax Request for post
    // $.ajax({
    //   url: "",
    //   type: "",
    //   success: function (data) {
    //     console.log("Success: ", data);
    //   },
    //   error: function (error) {
    //     console.log("Error:", error);
    //   },
    // });
  });
});
