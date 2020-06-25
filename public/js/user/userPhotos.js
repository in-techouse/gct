const photosUser = JSON.parse(localStorage.getItem("user"));
let photoUrl = "";
$(document).ready(function () {
  console.log("User Photos Document is ready");
  $("#confirmPhotoSelection").click(function () {
    if (photoUrl === null || photoUrl === undefined || photoUrl.length < 1) {
      return;
    }
    console.log("Selected Photo is: ", photoUrl);
    $("#choose-from-my-photo").modal("toggle");
    $("#update-header-photo").modal("toggle");

    $("#postImage").attr("src", photoUrl);
    $("#previewImage").attr("src", photoUrl);
    $("#url").val(photoUrl);
    setTimeout(function () {
      $("#imageUpper").fadeIn(400);
    }, 500);
  });
  getAllPhotos();
});

function savePhoto(url) {
  console.log("Save user photo, Url is: ", url);
  let photos = [];
  firebase
    .database()
    .ref()
    .child("Photos")
    .child(photosUser.id)
    .once("value")
    .then((data) => {
      data.forEach((p) => {
        photos.push(p.val());
      });
      console.log("Photos Data is: ", photos);
      let flag = true;
      photos.forEach((p) => {
        if (p === url) {
          flag = false;
        }
      });
      if (flag) {
        photos.push(url);
        console.log("Photos Updated Data is: ", photos);
        firebase
          .database()
          .ref()
          .child("Photos")
          .child(photosUser.id)
          .set(photos);
      }
    });
}

function getAllPhotos() {
  firebase
    .database()
    .ref()
    .child("Photos")
    .child(photosUser.id)
    .once("value")
    .then((data) => {
      data.forEach((p) => {
        showPhotoForPost(p.val());
        showLastPhotos(p.val());
      });
    });
}

function showPhotoForPost(photo) {
  const photoContent = `
    <div class="choose-photo-item" data-mh="choose-item" onclick="selectPhoto('${photo}')">
        <div class="radio">
            <label class="custom-radio">
                <img src="${photo}" alt="photo" style="height: 170px;">
                <input type="radio" name="optionsRadios">
                <span class="circle"></span>
                <span class="check"></span>
            </label>
        </div>
    </div>`;
  $("#previousPhotos").prepend(photoContent);
}

function showLastPhotos(photo) {
  const photoContent = `
    <li>
      <a href="${photo}">
        <img src="${photo}" alt="photo" style="width: 100%; height: 80px;">
      </a>
    </li>`;
  $("#lastPhotos").prepend(photoContent);
}

function selectPhoto(photo) {
  console.log("Selected Photo is: ", photo);
  photoUrl = photo;
}
