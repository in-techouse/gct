// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAFSBuiVUoFC18qzI3xd3EsGL_Fsy4y5VA",
  authDomain: "global-ct.firebaseapp.com",
  databaseURL: "https://global-ct.firebaseio.com",
  projectId: "global-ct",
  storageBucket: "global-ct.appspot.com",
  messagingSenderId: "559718967029",
  appId: "1:559718967029:web:6cd2b538b1fe3d940dc7bc",
  measurementId: "G-H4442SC9K6",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
let isFacebook = false;
let isTwitter = false;
let user = {
  firstName: "",
  lastName: "",
};
let finalSoundSettings = {
  notificationSound: "on",
  chatSound: "on",
};

// Save to Session
function saveToSession(userData) {
  $.ajax({
    type: "POST",
    url: "/userSession",
    dataType: "json",
    data: { user: JSON.stringify(userData) },
    success: function (result) {
      console.log("Session Success: ", result);
      $("#loading").hide(300);
      if (result === "1") {
        localStorage.setItem("user", JSON.stringify(userData));
        window.location.reload();
      } else {
        $("#mainAuth").show(300);
        $("#upperFacebook").show(300);
        $("#upperTwitter").show(300);
        $("#username").hide(300);
        $("#mainError").show(300);
      }
    },
    error: function (err) {
      console.log("Session Error: ", err);
      $("#loading").hide(300);
      $("#mainAuth").show(300);
      $("#upperFacebook").show(300);
      $("#upperTwitter").show(300);
      $("#username").hide(300);
      $("#mainError").show(300);
    },
  });
}

function loginwithTwitter(r) {
  firebase
    .database()
    .ref()
    .child("Users")
    .child(r.user.uid)
    .once("value")
    .then((data) => {
      let userData = data.val();
      let twitter = {
        accessToken: r.credential.accessToken,
        secret: r.credential.secret,
        username: r.additionalUserInfo.username,
        description:
          r.additionalUserInfo.profile.description === undefined
            ? ""
            : r.additionalUserInfo.profile.description === null
            ? ""
            : r.additionalUserInfo.profile.description,
        email:
          r.additionalUserInfo.profile.email === undefined
            ? ""
            : r.additionalUserInfo.profile.email === null
            ? ""
            : r.additionalUserInfo.profile.email,
        followersCount: r.additionalUserInfo.profile.followers_count,
        friendsCount: r.additionalUserInfo.profile.friends_count,
        id: r.additionalUserInfo.profile.id_str,
        location:
          r.additionalUserInfo.profile.location === undefined
            ? ""
            : r.additionalUserInfo.profile.location === null
            ? ""
            : r.additionalUserInfo.profile.location,
        name: r.additionalUserInfo.profile.name,
        profileBannerUrl:
          r.additionalUserInfo.profile.profile_banner_url === undefined
            ? ""
            : r.additionalUserInfo.profile.profile_banner_url === null
            ? ""
            : r.additionalUserInfo.profile.profile_banner_url,
        profileImageUrl:
          r.additionalUserInfo.profile.profile_image_url === undefined
            ? ""
            : r.additionalUserInfo.profile.profile_image_url === null
            ? ""
            : r.additionalUserInfo.profile.profile_image_url,
        screen_name: r.additionalUserInfo.profile.screen_name,
      };
      if (userData === undefined || userData === null) {
        user = {
          ...user,
          ...{
            twitter,
            email:
              r.user.email === undefined
                ? ""
                : r.user.email === null
                ? ""
                : r.user.email,
            phoneNumber:
              r.user.phoneNumber === undefined
                ? ""
                : r.user.phoneNumber === null
                ? ""
                : r.user.phoneNumber,
            id: r.user.uid,
            image: r.user.photoURL,
          },
        };
        console.log("GCT user: ", user);
        isTwitter = true;
        $("#upperTwitter").hide(300);
        $("#mainError").hide(300);
        $("#loading").hide(300);
        $("#mainAuth").show(300);
      } else {
        userData = {
          ...userData,
          ...{
            twitter,
          },
        };
        firebase
          .database()
          .ref()
          .child("Users")
          .child(userData.id)
          .set(userData)
          .then((r) => {
            console.log("Database Save Success");
            saveToSession(userData);
          })
          .catch((e) => {
            console.log("Database Save Failed: ", e);
            $("#loading").hide(300);
            $("#mainAuth").show(300);
            $("#upperTwitter").show(300);
            $("#upperFacebook").show(300);
          });
      }
    })
    .catch((e) => {
      $("#upperTwitter").show(300);
      $("#mainError").show(300);
      $("#loading").hide(300);
      $("#mainAuth").show(300);
    });
}

function loginWithFacebook(d) {
  firebase
    .database()
    .ref()
    .child("Users")
    .child(d.user.uid)
    .once("value")
    .then((data) => {
      let userData = data.val();
      let facebook = {
        accessToken: d.credential.accessToken,
        id: d.additionalUserInfo.profile.id,
        email:
          d.additionalUserInfo.profile.email === undefined
            ? ""
            : d.additionalUserInfo.profile.email === null
            ? ""
            : d.additionalUserInfo.profile.email,
        name: d.additionalUserInfo.profile.name,
      };
      console.log("Database User Data: ", userData);
      if (userData === undefined || userData === null) {
        console.log("New Registration Success");
        user = {
          ...user,
          ...{
            facebook,
            email:
              d.user.email === undefined
                ? ""
                : d.user.email === null
                ? ""
                : d.user.email,
            phoneNumber:
              d.user.phoneNumber === undefined
                ? ""
                : d.user.phoneNumber === null
                ? ""
                : d.user.phoneNumber,
            id: d.user.uid,
            image: d.user.photoURL,
          },
        };
        console.log("GCT user: ", user);
        isFacebook = true;
        $("#upperFacebook").hide(300);
        $("#loading").hide(300);
        $("#mainAuth").show(300);
      } else {
        userData = {
          ...userData,
          ...{
            facebook,
          },
        };
        firebase
          .database()
          .ref()
          .child("Users")
          .child(userData.id)
          .set(userData)
          .then((r) => {
            console.log("Database Save Success");
            saveToSession(userData);
          })
          .catch((e) => {
            console.log("Database Save Failed: ", e);
            $("#loading").hide(300);
            $("#mainAuth").show(300);
            $("#upperTwitter").show(300);
            $("#upperFacebook").show(300);
          });
      }
    })
    .catch((e) => {
      $("#upperFacebook").show(300);
      $("#mainError").show(300);
      $("#mainAuth").show(300);
      $("#loading").hide(300);
      console.log("Database User Data Error: ", e);
    });
}

$(document).ready(function () {
  console.log("Main Script Document is ready");

  finalSoundSettings = localStorage.getItem("soundSettings");
  if (finalSoundSettings === null || finalSoundSettings === undefined) {
    finalSoundSettings = {
      notificationSound: "on",
      chatSound: "on",
    };
  } else {
    finalSoundSettings = JSON.parse(finalSoundSettings);
  }
  console.log("Main Script, Final Sound Setting is: ", finalSoundSettings);
  setTimeout(function () {
    console.log("Time out called");
    $("#hellopreloader").fadeOut(1000);
  }, 1000);

  $("#previewPost").click(function () {
    console.log("Preview Post Clicked");
    let userContent = $("#userContent").val();
    console.log("User Content: ", userContent);
    $("#postText").text(userContent);
  });

  $("#userNameForm").submit(function (e) {
    e.preventDefault();
    let firstname = $("#firstname").val();
    let lastname = $("#lastname").val();
    user.firstName = firstname;
    user.lastName = lastname;
    console.log("GCT user: ", user);
    $("#loading").show(300);
    $("#username").hide(300);
    firebase
      .database()
      .ref()
      .child("Users")
      .child(user.id)
      .set(user)
      .then((r) => {
        console.log("Database Save Success");
        saveToSession(user);
      })
      .catch((e) => {
        console.log("Database Save Failed: ", e);
        $("#loading").hide(300);
        $("#username").show(300);
      });
  });

  $("#facebookLogin").click(function () {
    console.log("Clicked");
    $("#mainError").hide(300);
    $("#loading").show(300);
    $("#mainAuth").hide(300);
    var provider = new firebase.auth.FacebookAuthProvider();
    if (isTwitter) {
      firebase
        .auth()
        .currentUser.linkWithPopup(provider)
        .then((d) => {
          console.log("Facebook User: ", d);
          let facebook = {
            accessToken: d.credential.accessToken,
            id: d.additionalUserInfo.profile.id,
            email:
              d.additionalUserInfo.profile.email === undefined
                ? ""
                : d.additionalUserInfo.profile.email === null
                ? ""
                : d.additionalUserInfo.profile.email,
            name: d.additionalUserInfo.profile.name,
          };
          user = {
            ...user,
            ...{
              facebook,
              email:
                d.user.email === undefined
                  ? ""
                  : d.user.email === null
                  ? ""
                  : d.user.email,
              phoneNumber:
                d.user.phoneNumber === undefined
                  ? ""
                  : d.user.phoneNumber === null
                  ? ""
                  : d.user.phoneNumber,
              id: d.user.uid,
              image: d.user.photoURL,
            },
          };
          console.log("GCT user: ", user);
          isFacebook = true;
          $("#upperFacebook").show(300);
          $("#mainError").hide(300);
          $("#mainAuth").hide(300);
          $("#loading").hide(300);
          $("#username").show(300);
        })
        .catch((e) => {
          $("#mainError").show(300);
          $("#loading").hide(300);
          $("#mainAuth").show(300);
        });
    } else {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((r) => {
          console.log("Facebook User: ", r);
          loginWithFacebook(r);
        })
        .catch((e) => {
          console.log("Error: ", e);
          $("#mainError").show(300);
          $("#loading").hide(300);
          $("#mainAuth").show(300);
        });
    }
  });

  $("#twitterLogin").click(function () {
    console.log("Clicked");
    $("#mainError").hide(300);
    $("#loading").show(300);
    $("#mainAuth").hide(300);
    var provider = new firebase.auth.TwitterAuthProvider();
    if (isFacebook) {
      firebase
        .auth()
        .currentUser.linkWithPopup(provider)
        .then((r) => {
          console.log("Twitter User: ", r);
          let twitter = {
            accessToken: r.credential.accessToken,
            secret: r.credential.secret,
            username: r.additionalUserInfo.username,
            description:
              r.additionalUserInfo.profile.description === undefined
                ? ""
                : r.additionalUserInfo.profile.description === null
                ? ""
                : r.additionalUserInfo.profile.description,
            email:
              r.additionalUserInfo.profile.email === undefined
                ? ""
                : r.additionalUserInfo.profile.email === null
                ? ""
                : r.additionalUserInfo.profile.email,
            followersCount: r.additionalUserInfo.profile.followers_count,
            friendsCount: r.additionalUserInfo.profile.friends_count,
            id: r.additionalUserInfo.profile.id_str,
            location:
              r.additionalUserInfo.profile.location === undefined
                ? ""
                : r.additionalUserInfo.profile.location === null
                ? ""
                : r.additionalUserInfo.profile.location,
            name: r.additionalUserInfo.profile.name,
            profileBannerUrl:
              r.additionalUserInfo.profile.profile_banner_url === undefined
                ? ""
                : r.additionalUserInfo.profile.profile_banner_url === null
                ? ""
                : r.additionalUserInfo.profile.profile_banner_url,
            profileImageUrl:
              r.additionalUserInfo.profile.profile_image_url === undefined
                ? ""
                : r.additionalUserInfo.profile.profile_image_url === null
                ? ""
                : r.additionalUserInfo.profile.profile_image_url,
          };
          user = {
            ...user,
            ...{
              twitter,
              email:
                r.user.email === undefined
                  ? ""
                  : r.user.email === null
                  ? ""
                  : r.user.email,
              phoneNumber:
                r.user.phoneNumber === undefined
                  ? ""
                  : r.user.phoneNumber === null
                  ? ""
                  : r.user.phoneNumber,
              id: r.user.uid,
              image: r.user.photoURL,
            },
          };
          console.log("GCT user: ", user);
          isTwitter = true;
          $("#upperTwitter").hide(300);
          $("#mainError").hide(300);
          $("#loading").hide(300);
          $("#username").show(300);
        })
        .catch((e) => {
          $("#mainError").show(300);
          $("#loading").hide(300);
          $("#mainAuth").show(300);
        });
    } else {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((r) => {
          console.log("Success: ", r);
          loginwithTwitter(r);
        })
        .catch((e) => {
          console.log("Twitter Error: ", e);
          $("#mainError").show(300);
          $("#loading").hide(300);
          $("#mainAuth").show(300);
        });
    }
  });

  $("#deletePostForm").submit(function (e) {
    $("#deleteClose").hide(300);
    $("#deleteConfirm").hide(300);
    $("#deleteLoading").show(400);
    e.preventDefault();
    console.log("Form is stopped");
    const postId = $("#deletePostId").val();
    console.log("Post Id to be deleted is: ", postId);
    const dbRef = firebase.database().ref();
    // Delete Post Notifications
    dbRef
      .child("Notifications")
      .orderByChild("postId")
      .equalTo(postId)
      .once("value")
      .then((notifications) => {
        notifications.forEach((n) => {
          dbRef.child("Notifications").child(n.val().id).remove();
        });
      });
    // Delete Post Likes
    dbRef
      .child("Likes")
      .orderByChild("postId")
      .equalTo(postId)
      .once("value")
      .then((likes) => {
        likes.forEach((like) => {
          dbRef.child("Likes").child(like.val().id).remove();
        });
      });
    // Delete Post Comments
    dbRef
      .child("Comments")
      .orderByChild("postId")
      .equalTo(postId)
      .once("value")
      .then((comments) => {
        comments.forEach((c) => {
          dbRef.child("Comments").child(c.val().id).remove();
        });
      });
    // Delete Post
    dbRef.child("Posts").child(postId).remove();
    setTimeout(function () {
      window.location.href = "/user/newsfeed";
    }, 2000);
  });
});

function getTimeDifference(timeStamps) {
  let current = moment();
  let postTime = moment.unix(timeStamps);
  let hours = current.diff(postTime, "hours", true);
  let minutes = current.diff(postTime, "minutes", true);
  let formattedTime = "";
  if (hours < 23) {
    if (hours >= 1) {
      let finalHour = Math.round(hours);
      formattedTime = "" + finalHour + " hours ago";
    } else {
      let finalMinutes = Math.round(minutes);
      formattedTime = finalMinutes + " minutes ago";
    }
  } else {
    formattedTime = moment(postTime).format("ddd, Do, MMM-YYYY hh:mm A");
  }
  return formattedTime;
}

function appendPostToUserTimeline(post) {
  const postUser = JSON.parse(localStorage.getItem("user"));
  let postHtml = "";
  let tweetMedia = "";
  if (post.url !== null && post.url !== undefined && post.url.length > 1) {
    tweetMedia = `
      <div class="post-thumb">
        <img src="${post.url}"/>
      </div>`;
  }
  let profileUrl = "";
  let editDelete = "";
  if (post.userId === postUser.id) {
    profileUrl = "/userProfile/profile";
    editDelete = `<div class="more">
    <svg class="olymp-three-dots-icon">
      <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-three-dots-icon"></use>
    </svg>
    <ul class="more-dropdown">
      <li>
        <a href="/user/editPost?id=${post.id}">Edit Post</a>
      </li>
      <li>
        <a onclick="deletePostConfirmation('${post.id}')" href="javascript:;" data-toggle="modal" data-target="#delete-post">Delete Post</a>
      </li>
    </ul>
  </div>`;
  } else {
    profileUrl = "/userFriend/friendProfile?id=" + post.userId;
  }
  postHtml = `
    <div class="ui-block">
      <article class="hentry post has-post-thumbnail shared-photo">
      <div class="post__author author vcard inline-items">
        <img src="${post.userImg}" alt="author">
        <div class="author-date">
          <a class="h6 post__author-name fn" href="${profileUrl}" target="_blank">
            ${post.userName}
          </a>
          <div class="post__date">
            <time class="published" datetime="2004-07-24T18:18">
              ${getTimeDifference(post.timeStamps)}
            </time>
          </div>
        </div>
        ${editDelete}
      </div>
      <p>${post.content}</p>
      ${tweetMedia}
      <div class="post-additional-info inline-items">
        <a href="javascript:;" class="post-add-icon inline-items" id="likeHeart${
          post.id
        }" onclick="likePost('${post.id}')">
          <svg class="olymp-heart-icon">
            <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-heart-icon"></use>
          </svg>
          <span id="likesCount${post.id}">${post.likes}</span>
        </a>
        <ul class="friends-harmonic" id="friends-harmonic${post.id}">
        </ul>
        <div class="names-people-likes" id="names-people-likes${post.id}">
          <p id="andMorePeople${post.id}"></p>
        </div>
        <div class="comments-shared">
          <a href="javascript:;" class="post-add-icon inline-items" onclick="showPostMyComment('${
            post.id
          }')">
            <svg class="olymp-speech-balloon-icon">
              <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-speech-balloon-icon">
              </use>
            </svg>
            <span id="commentsCount${post.id}">${post.comments}</span>
          </a>
        </div>
      </div>
      <div class="control-block-button post-control-button">
        <a href="javascript:;" class="btn btn-control" id="likeBtn${
          post.id
        }" onclick="likePost('${post.id}')">
          <svg class="olymp-like-post-icon">
            <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-like-post-icon"></use>
          </svg>
        </a>
        <a href="javascript:;" class="btn btn-control" onclick="showPostMyComment('${
          post.id
        }')">
          <svg class="olymp-comments-post-icon">
            <use xlink:href="/public/svg-icons/sprites/icons.svg#olymp-comments-post-icon">
            </use>
          </svg>
        </a>
      </div>
    </article>
    <div class="row" id="loadingComments${post.id}" style="display: none;">
      <div class="col-md-4"></div>
      <div class="col-md-4">
        <center>
          <img src="/public/img/loadingg.gif" style="width: 40px" />
        </center>
      </div>
      <div class="col-md-4"></div>
    </div>
    <ul class="comments-list postComments${
      post.id
    }" style="display: none;">            
    </ul>
    <form id="postMyComment${
      post.id
    }" class="comment-form inline-items postMyComment${
    post.id
  }" style="display: none;">

      <div class="post__author author vcard inline-items">
        <img src="${postUser.image}" alt="author">

        <div class="form-group with-icon-right ">
          <textarea class="form-control" placeholder="" id="postCommentContent${
            post.id
          }"></textarea>
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
      <div style="width: auto; float: right;">
        <button class="btn btn-md-2 btn-primary" id="postCommentButton${
          post.id
        }">Post Comment</button>

        <a href="javascript:;" onclick="showPostMyComment('${
          post.id
        }')" class="btn btn-md-2 btn-border-think c-grey btn-transparent custom-color" style="margin-right: 10px; margin-top: 15px; padding: .8rem 2.1rem !important">Cancel
        </a>
      </div>

    </form>
  </div>
          `;
  $("#newsfeed-items-grid").prepend(postHtml);
  getLikesForPost(post.id);
}

function deletePostConfirmation(postId) {
  console.log("Delete post id is: ", postId);
  $("#deletePostId").val(postId);
}
