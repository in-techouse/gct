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
});
