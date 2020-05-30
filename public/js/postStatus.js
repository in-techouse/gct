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
    $("#submitPost").prop("disabled", true);
    console.log("Form is stopped.");
    let userContent = $("#userContent").val();
    console.log("Content: ", userContent);
    let userId = $("#userId").val();
    let url = $("#url").val();
    let isTwitter = $("#twitterPost").hasClass("btn-primary");

    let isFacebook = $("#facebookPost").hasClass("btn-primary");

    let isImage = false;
    if (url !== null && url !== undefined && url.length > 1) {
      isImage = true;
    }

    // Save Status to database
    let post = {
      content: userContent,
      id: "",
      userId: userId,
      url: url,
      isImage: isImage,
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
        $("#submitPost").prop("disabled", false);
      })
      .catch((e) => {
        console.log("Post Failure: ", e);
        $("#submitPost").prop("disabled", false);
      });
  });
});

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#postImage").attr("src", e.target.result);
      $("#previewImage").attr("src", e.target.result);
      $("#imageUpper").show(400);
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
