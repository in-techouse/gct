$(document).ready(function () {
  console.log("Post Status Document is ready");

  $("#photoUploadIcon").click(function () {
    $("#photoUpload").trigger("click");
  });

  $("#photoUpload").change(function () {
    readURL(this);
  });

  $("#twitterPost").click(function () {
    let isChecked = $("#twitterPost").hasClass("btn-outline-primary");
    console.log("Twitter Post: ", isChecked);
    if (isChecked) {
      $("#twitterPost").removeClass("btn-outline-primary");
      $("#twitterPost").addClass("btn-primary");
    } else {
      $("#twitterPost").removeClass("btn-primary");
      $("#twitterPost").addClass("btn-outline-primary");
    }
  });

  $("#facebookPost").click(function () {
    let isChecked = $("#facebookPost").hasClass("btn-outline-primary");
    console.log("Facebook Post: ", isChecked);
    if (isChecked) {
      $("#facebookPost").removeClass("btn-outline-primary");
      $("#facebookPost").addClass("btn-primary");
    } else {
      $("#facebookPost").removeClass("btn-primary");
      $("#facebookPost").addClass("btn-outline-primary");
    }
  });

  $("#postStatus").submit(function (event) {
    event.preventDefault();
    console.log("Form is stopped.");
    let userContent = $("#userContent").val();
    console.log("Content: ", userContent);

    let isTwitter = $("#twitterPost").hasClass("btn-primary");

    let isFacebook = $("#facebookPost").hasClass("btn-primary");

    // Save Status to database
    let post = {
      content: userContent,
      id: "",
      userId: "",
      url: "",
      isImage: true,
      isFacebook: isFacebook,
      isTwitter: isTwitter,
    };

    post.id = firebase.database().ref().child("Posts").push().key;
    console.log("Post: ", post);

    firebase
      .database()
      .ref()
      .child("Posts")
      .child(post.id)
      .set(post)
      .then((r) => {
        console.log("Post Success");
        $("#userContent").val("");
      })
      .catch((e) => {
        console.log("Post Failure: ", e);
      });
  });
});

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#postImage").attr("src", e.target.result);
      $("#imageUpper").show(400);
    };

    reader.readAsDataURL(input.files[0]);
  }
}
