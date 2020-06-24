let socialImageBase64 = null;

$(document).ready(function () {
  console.log("Post Status Document is ready");

  $("#removeImage").click(function () {
    $("#imageUpper").hide(400);
    $("#postImage").attr("src", null);
    $("#previewImage").attr("src", null);
    $("#url").val("");
  });

  $("#photoUploadIcon").click(function () {
    $("#photoUpload").trigger("click");
  });

  $("#photoUpload").change(function () {
    $("#update-header-photo").modal("toggle");
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
    $("#submitPost").prop("disabled", true);
    console.log("Form is stopped.");
    let userContent = $.trim($("#userContent").val());
    console.log("Content: ", userContent);
    let userId = $("#userId").val();
    let userImg = $("#userImg").val();
    let userName = $("#userName").val();

    let url = $("#url").val();
    let isTwitter = $("#twitterPost").hasClass("btn-primary");

    let isFacebook = $("#facebookPost").hasClass("btn-primary");

    let isImage = false;
    if (url !== null && url !== undefined && url.length > 1) {
      isImage = true;
    }
    if (
      isImage === false &&
      (userContent === null ||
        userContent === undefined ||
        userContent.length < 1)
    ) {
      $("#submitPost").prop("disabled", false);
      return;
    }
    let timeStamps = parseInt(moment().format("X"));
    let formattedTime = moment().format("ddd, Do, MMM-YYYY hh:mm A");
    let currentUser = JSON.parse(localStorage.getItem("user"));
    // Save Status to database
    let post = {
      content: userContent,
      id: "",
      userId,
      userName,
      userImg,
      url: url,
      isImage,
      isFacebook,
      isTwitter,
      timeStamps,
      formattedTime,
      likes: 0,
      comments: 0,
      facebookId: currentUser.facebook.id,
      twitterId: currentUser.twitter.id,
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
        $("#imageUpper").hide(400);

        $("#twitterPost").removeClass("btn-primary");
        $("#twitterPost").addClass("btn-outline-primary");

        $("#facebookPost").removeClass("btn-primary");
        $("#facebookPost").addClass("btn-outline-primary");

        $("#postImage").attr("src", null);
        $("#previewImage").attr("src", null);
        $("#url").val("");
        $("#userContent").val("");
        $("#submitPost").prop("disabled", false);
        appendPostToUserTimeline(post);
        postOnSocialMedia(post);
      })
      .catch((e) => {
        console.log("Post Failure: ", e);
        $("#submitPost").prop("disabled", false);
      });
  });
});

function postOnSocialMedia(post) {
  console.log("Post on Social Media with post: ", post);
  if (post.isTwitter) {
    $.ajax({
      type: "POST",
      url: "/user/postOnTwitter",
      dataType: "json",
      data: {
        post: JSON.stringify(post),
        socialImageBase64: socialImageBase64,
      },
      success: function (result) {
        console.log("postOnTwitter Success: ", result);
        if (result !== "-1") {
          if (result.success) {
            $("#statusSuccessAlert").show(300);
            $("#statusSuccessAlert").text(result.message);
            setTimeout(function () {
              $("#statusSuccessAlert").hide(300);
              $("#statusSuccessAlert").text("");
            }, 5000);
          } else {
            $("#statusFailAlert").show(300);
            $("#statusFailAlert").text(result.message);
            setTimeout(function () {
              $("#statusFailAlert").hide(300);
              $("#statusFailAlert").text("");
            }, 5000);
          }
        }
      },
      error: function (err) {
        console.log("postOnTwitter Error: ", err);
        $("#statusFailAlert").show(300);
        $("#statusFailAlert").text(
          "Something went wrong. Please try again later."
        );
        setTimeout(function () {
          $("#statusFailAlert").hide(300);
          $("#statusFailAlert").text("");
        }, 5000);
      },
    });
  }

  // if (post.isFacebook) {
  //   $.ajax({
  //     type: "POST",
  //     url: "/user/postOnFacebook",
  //     dataType: "json",
  //     data: {
  //       post: JSON.stringify(post),
  //       socialImageBase64: socialImageBase64,
  //     },
  //     success: function (result) {
  //       console.log("postOnFacebook Success: ", result);
  //       if (result !== "-1") {
  //         if (result.success) {
  //           $("#statusSuccessAlert").show(300);
  //           $("#statusSuccessAlert").text(result.message);
  //           setTimeout(function () {
  //             $("#statusSuccessAlert").hide(300);
  //             $("#statusSuccessAlert").text("");
  //           }, 5000);
  //         } else {
  //           $("#statusFailAlert").show(300);
  //           $("#statusFailAlert").text(result.message);
  //           setTimeout(function () {
  //             $("#statusFailAlert").hide(300);
  //             $("#statusFailAlert").text("");
  //           }, 5000);
  //         }
  //       }
  //     },
  //     error: function (err) {
  //       $("#statusFailAlert").show(300);
  //       $("#statusFailAlert").text(
  //         "Something went wrong. Please try again later."
  //       );
  //       setTimeout(function () {
  //         $("#statusFailAlert").hide(300);
  //         $("#statusFailAlert").text("");
  //       }, 5000);
  //     },
  //   });
  // }
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      socialImageBase64 = e.target.result;
      $("#postImage").attr("src", socialImageBase64);
      $("#previewImage").attr("src", socialImageBase64);
      $("#imageUpper").show(400);
      socialImageBase64 = socialImageBase64.replace(
        /^data:image\/png;base64,/,
        ""
      );
      socialImageBase64 = socialImageBase64.replace(
        /^data:image\/jpeg;base64,/,
        ""
      );
      socialImageBase64 = socialImageBase64.replace(
        /^data:image\/gif;base64,/,
        ""
      );
      socialImageBase64 = socialImageBase64.replace(
        /^data:image\/jpg;base64,/,
        ""
      );
      uploadFile();
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function uploadFile() {
  $("#submitPost").prop("disabled", true);
  console.log("Starting Upload");
  var file = document.getElementById("photoUpload").files[0];
  let dateTime = new Date().getTime();
  var fileName = dateTime + file.name;
  console.log("File: ", file);
  console.log("Date Tme: ", dateTime);
  console.log("File Name: ", fileName);
  let userId = $("#userId").val();
  console.log("UserId: ", userId);
  var ref = firebase
    .storage()
    .ref("Users")
    .child(userId)
    .child("Posts")
    .child(fileName);
  var uploadTask = ref.put(file);
  console.log("File Upload Started");
  uploadTask.on(
    "state_changed",
    function (snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      progress = progress.toFixed(2);
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log("Upload is paused");
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log("Upload is running");
          break;
      }
    },
    function (error) {
      $("#submitPost").prop("disabled", false);
      console.log("Upload Error: ", error);
    },
    function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log("File available at", downloadURL);
        $("#url").val(downloadURL);
        $("#submitPost").prop("disabled", false);
      });
    }
  );
}
