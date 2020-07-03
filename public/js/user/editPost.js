$(document).ready(function () {
  console.log("Edit post ready");

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

  $("#photoUploadIcon").click(function () {
    $("#photoUpload").trigger("click");
  });

  $("#photoUpload").change(function () {
    $("#update-header-photo").modal("toggle");
    readURL(this);
  });

  $("#removeImage").click(function () {
    $("#imageUpper").fadeOut(400);
    $("#url").val("");
    $("#isImage").val("false");
    $("#photoUpload").val("");
    setTimeout(function () {
      $("#postImage").attr("src", null);
      $("#previewImage").attr("src", null);
    }, 500);
  });
});

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
      $("#isImage").val("true");
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
