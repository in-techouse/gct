$(document).ready(function () {
  console.log("Post Status Document is ready");

  $("#photoUploadIcon").click(function () {
    $("#photoUpload").trigger("click");
  });

  $("#photoUpload").change(function () {
    readURL(this);
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

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#postImage").attr("src", e.target.result);
      $("#imageUpper").show(400);
      // $("#showDesign").addClass("img-thumbnail");
    };

    reader.readAsDataURL(input.files[0]);
  }
}
