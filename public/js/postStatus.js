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
        let tweetHTML = `
        <div class="ui-block">
					<article class="hentry post has-post-thumbnail shared-photo">
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
                    <a href="javascript:;">Edit Post</a>
                  </li>
                  <li>
                    <a href="javascript:;">Delete Post</a>
                  </li>
								</ul>
							</div>
            </div>
            <p>${post.content}</p>
            <div class="post-thumb">         
              <img src="${post.url}" />
            </div>
						<div class="post-additional-info inline-items">
							<a href="javascript:;" class="post-add-icon inline-items" id="likeHeart${post.id}" onclick="likePost('${post.id}')">
								<svg class="olymp-heart-icon">
									<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-heart-icon"></use>
								</svg>
								<span id="likesCount${post.id}">${post.likes}</span>
							</a>

							<ul class="friends-harmonic">
							</ul>

							<div class="names-people-likes">
							</div>

							<div class="comments-shared">
								<a href="javascript:;" class="post-add-icon inline-items" onclick="showPostMyComment('${post.id}')">
									<svg class="olymp-speech-balloon-icon">
										<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-speech-balloon-icon">
										</use>
									</svg>
									<span>${post.comments}</span>
								</a>
							</div>
						</div>

						<div class="control-block-button post-control-button">

							<a href="javascript:;" class="btn btn-control" id="likeBtn${post.id}" onclick="likePost('${post.id}')">
								<svg class="olymp-like-post-icon">
									<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-like-post-icon"></use>
								</svg>
							</a>

							<a href="javascript:;" class="btn btn-control" onclick="showPostMyComment('${post.id}')">
								<svg class="olymp-comments-post-icon">
									<use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-comments-post-icon">
									</use>
								</svg>
							</a>
						</div>
          </article>
          <ul class="comments-list postComments${post.id}" style="display: none;">
          <li class="comment-item">
            <div class="post__author author vcard inline-items">
              <img src="/public/img/author-page.jpg" alt="author">
    
              <div class="author-date">
                <a class="h6 post__author-name fn" href="02-ProfilePage.html">James Spiegel</a>
                <div class="post__date">
                  <time class="published" datetime="2004-07-24T18:18">
                    38 mins ago
                  </time>
                </div>
              </div>
    
              <a href="javascript:;" class="more"><svg class="olymp-three-dots-icon">
                  <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-three-dots-icon">
                  </use>
                </svg></a>
    
            </div>
    
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium der doloremque
              laudantium.</p>
    
            <a href="javascript:;" class="post-add-icon inline-items">
              <svg class="olymp-heart-icon">
                <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-heart-icon"></use>
              </svg>
              <span>3</span>
            </a>
            <a href="javascript:;" class="reply">Reply</a>
          </li>
          <li class="comment-item">
            <div class="post__author author vcard inline-items">
              <img src="/public/img/avatar1-sm.jpg" alt="author">
    
              <div class="author-date">
                <a class="h6 post__author-name fn" href="javascript:;">Mathilda Brinker</a>
                <div class="post__date">
                  <time class="published" datetime="2004-07-24T18:18">
                    1 hour ago
                  </time>
                </div>
              </div>
    
              <a href="javascript:;" class="more"><svg class="olymp-three-dots-icon">
                  <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-three-dots-icon">
                  </use>
                </svg></a>
    
            </div>
    
            <p>Ratione voluptatem sequi en lod nesciunt. Neque porro quisquam est, quinder dolorem ipsum
              quia dolor sit amet, consectetur adipisci velit en lorem ipsum duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum.
            </p>
    
            <a href="javascript:;" class="post-add-icon inline-items">
              <svg class="olymp-heart-icon">
                <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-heart-icon"></use>
              </svg>
              <span>8</span>
            </a>
            <a href="javascript:;" class="reply">Reply</a>
          </li>
        </ul>
        <a href="javascript:;" class="postMoreComments${post.id} more-comments" style="display: none;">View more comments <span>+</span></a>
        <form class="comment-form inline-items postMyComment${post.id}" style="display: none;">
    
          <div class="post__author author vcard inline-items">
            <img src="${userImg}" alt="author">
    
            <div class="form-group with-icon-right ">
              <textarea class="form-control" placeholder=""></textarea>
              <div class="add-options-message">
                <a href="javascript:;" class="options-message" data-toggle="modal"
                  data-target="#update-header-photo">
                  <svg class="olymp-camera-icon">
                    <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-camera-icon">
                    </use>
                  </svg>
                </a>
              </div>
            </div>
          </div>
    
          <button class="btn btn-md-2 btn-primary">Post Comment</button>
    
          <button onclick="showPostMyComment('${post.id}')"
            class="btn btn-md-2 btn-border-think c-grey btn-transparent custom-color">Cancel</button>
    
        </form>
				</div>`;
        $("#newsfeed-items-grid").prepend(tweetHTML);
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

  if (post.isFacebook) {
    $.ajax({
      type: "POST",
      url: "/user/postOnFacebook",
      dataType: "json",
      data: {
        post: JSON.stringify(post),
        socialImageBase64: socialImageBase64,
      },
      success: function (result) {
        console.log("postOnFacebook Success: ", result);
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
