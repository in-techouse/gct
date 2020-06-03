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
    let userImg = $("#userImg").val();
    let userName = $("#userName").val();

    let url = $("#url").val();
    let isTwitter = $("#twitterPost").hasClass("btn-primary");

    let isFacebook = $("#facebookPost").hasClass("btn-primary");

    let isImage = false;
    if (url !== null && url !== undefined && url.length > 1) {
      isImage = true;
    }
    let timeStamps = parseInt(moment().format("X"));
    let formattedTime = moment().format("ddd, Do, MMM-YYYY hh:mm A");

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
        let tweetHTML = `
                    <div class="ui-block">

					<article class="hentry post video">

						<div class="post__author author vcard inline-items">
							<img src="${userImg}" alt="author">

							<div class="author-date">
								<a class="h6 post__author-name fn" href="userImg" target="_blank">${userName}</a>
								<div class="post__date">
									<time class="published" datetime="2004-07-24T18:18">
										Just now
									</time>
								</div>
							</div>

							<div class="more"><svg class="olymp-three-dots-icon">
									<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-three-dots-icon"></use>
								</svg>
								<ul class="more-dropdown">
									<li>
										<a href="#">Edit Post</a>
									</li>
									<li>
										<a href="#">Delete Post</a>
									</li>
									<li>
										<a href="#">Turn Off Notifications</a>
									</li>
									<li>
										<a href="#">Select as Featured</a>
									</li>
								</ul>
							</div>

            </div>
            <div class="row">            
            ${post.content}
            </div>
            <div class="row">            
            <img src="${post.url}" />
            </div>
						<div class="post-additional-info inline-items">
							<a href="#" class="post-add-icon inline-items">
								<svg class="olymp-heart-icon">
									<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-heart-icon"></use>
								</svg>
								<span>18</span>
							</a>

							<ul class="friends-harmonic">
								<li>
									<a href="#">
										<img src="/public/img/friend-harmonic9.jpg" alt="friend">
									</a>
								</li>
								<li>
									<a href="#">
										<img src="/public/img/friend-harmonic10.jpg" alt="friend">
									</a>
								</li>
								<li>
									<a href="#">
										<img src="/public/img/friend-harmonic7.jpg" alt="friend">
									</a>
								</li>
								<li>
									<a href="#">
										<img src="/public/img/friend-harmonic8.jpg" alt="friend">
									</a>
								</li>
								<li>
									<a href="#">
										<img src="/public/img/friend-harmonic11.jpg" alt="friend">
									</a>
								</li>
							</ul>

							<div class="names-people-likes">
								<a href="#">Jenny</a>, <a href="#">Robert</a> and
								<br>18 more liked this
							</div>

							<div class="comments-shared">
								<a href="#" class="post-add-icon inline-items">
									<svg class="olymp-speech-balloon-icon">
										<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-speech-balloon-icon">
										</use>
									</svg>

									<span>0</span>
								</a>

								<a href="#" class="post-add-icon inline-items">
									<svg class="olymp-share-icon">
										<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-share-icon"></use>
									</svg>

									<span>16</span>
								</a>
							</div>
						</div>

						<div class="control-block-button post-control-button">

							<a href="#" class="btn btn-control">
								<svg class="olymp-like-post-icon">
									<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-like-post-icon"></use>
								</svg>
							</a>

							<a href="#" class="btn btn-control">
								<svg class="olymp-comments-post-icon">
									<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-comments-post-icon">
									</use>
								</svg>
							</a>

							<a href="#" class="btn btn-control">
								<svg class="olymp-share-icon">
									<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-share-icon"></use>
								</svg>
							</a>

						</div>

					</article>
				</div>`;
        $("#newsfeed-items-grid").prepend(tweetHTML);
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
