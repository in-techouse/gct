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
function loginwithTwitter(d) {
  // $.ajax({
  //   url: "/twitterLogin",
  //   type: "POST",
  //   data: {
  //     accessToken: d.credential.accessToken,
  //     secret: d.credential.secret,
  //   },
  //   success: function (data) {
  //     console.log("Success: ", data);
  //     if (data == "-1") {
  //       $("#upperTwitter").show(300);
  //       $("#mainError").show(300);
  //     } else if (data == "2") {
  //       // window.location.reload();
  //       $("#username").show(300);
  //     } else if (data == "3") {
  //       window.location.reload();
  //     }
  //     $("#loading").hide(300);
  //     $("#mainAuth").show(300);
  //   },
  //   error: function (error) {
  //     console.log("Error:", error);
  //     $("#upperTwitter").show(300);
  //     $("#mainError").show(300);
  //   },
  // });
}

function loginWithFacebook(d) {
  firebase
    .database()
    .ref()
    .child("Users")
    .child(d.user.uid)
    .once("value")
    .then((data) => {
      // console.log("Database User Data: ", data);
      let userData = data.val();
      console.log("Database User Data: ", userData);
      if (userData === undefined || userData === null) {
        console.log("New Registration Success");
        isFacebook = true;
        let facebook = {
          accessToken: d.credential.accessToken,
          id: d.additionalUserInfo.profile.id,
          email: d.additionalUserInfo.profile.email,
          name: d.additionalUserInfo.profile.name,
        };
        user = {
          ...user,
          ...{
            facebook,
            email: d.user.email,
            phoneNumber: d.user.phoneNumber,
            id: d.user.uid,
            image: d.user.photoURL,
          },
        };
        console.log("GCT user: ", user);
      }
      $("#loading").hide(300);
      $("#mainAuth").show(300);
    })
    .catch((e) => {
      $("#upperFacebook").show(300);
      $("#mainError").show(300);
      $("#mainAuth").show(300);
      $("#loading").hide(300);
      console.log("Database User Data Error: ", e);
    });
  // $.ajax({
  //   url: "/facebookLogin",
  //   type: "POST",
  //   data: {
  //     accessToken: d.credential.accessToken,
  //   },
  //   success: function (data) {
  //     console.log("Success: ", data);
  //     if (data == "-1") {
  //       $("#upperFacebook").show(300);
  //       $("#mainError").show(300);
  //     } else if (data == "2") {
  //       window.location.reload();
  //       $("#username").show(300);
  //     } else if (data == "3") {
  //       window.location.reload();
  //     }
  //     $("#loading").hide(300);
  //     $("#mainAuth").show(300);
  //   },
  //   error: function (error) {
  //     console.log("Error:", error);
  //     $("#mainError").show(300);
  //   },
  // });
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
        $("#loading").hide(300);
        $("#username").show(300);
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
    // let signIn = 1;
    // if (firebase.auth().currentUser === null) {
    //   signIn = 0;
    // }
    if (isTwitter) {
    } else {
      var provider = new firebase.auth.FacebookAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((r) => {
          // console.log("Success: ", r);
          $("#upperFacebook").hide(300);
          // $("#loading").hide(300);
          // New Code
          // console.log("Credential: ", r.credential);
          // console.log("User: ", r.user);
          // let facebook = {
          //   accessToken: r.credential.accessToken,
          //   id: r.additionalUserInfo.profile.id,
          //   email: r.additionalUserInfo.profile.email,
          //   name: r.additionalUserInfo.profile.name,
          // };
          // let user = {
          //   facebook,
          //   name: r.user.displayName,
          //   email: r.user.email,
          //   phoneNumber: r.user.phoneNumber,
          //   id: r.user.uid,
          //   image: r.user.photoURL,
          // };
          // console.log("GCT user: ", user);
          // Old Code
          // $("#upperFacebook").hide(300);
          // if (signIn === 1) {
          //   firebase
          //     .auth()
          //     .currentUser.delete()
          //     .then((d) => {
          //       loginWithFacebook(r);
          //     });
          // } else {
          loginWithFacebook(r);
          // }
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
          // console.log("Twitter User: ", r);
          let twitter = {
            accessToken: r.credential.accessToken,
            secret: r.credential.secret,
            username: r.additionalUserInfo.username,
            description: r.additionalUserInfo.profile.description,
            email: r.additionalUserInfo.profile.email,
            followersCount: r.additionalUserInfo.profile.followers_count,
            friendsCount: r.additionalUserInfo.profile.friends_count,
            id: r.additionalUserInfo.profile.id_str,
            location: r.additionalUserInfo.profile.location,
            name: r.additionalUserInfo.profile.name,
            profileBannerUrl: r.additionalUserInfo.profile.profile_banner_url,
            profileImageUrl: r.additionalUserInfo.profile.profile_image_url,
          };
          user = {
            ...user,
            ...{
              twitter,
              name: r.user.displayName,
              email: r.user.email,
              phoneNumber: r.user.phoneNumber,
              id: r.user.uid,
              image: r.user.photoURL,
            },
          };
          console.log("GCT user: ", user);
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
      // let signIn = 1;
      // if (firebase.auth().currentUser === null) {
      //   signIn = 0;
      // }
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((r) => {
          console.log("Success: ", r);

          // Old Code
          // $("#upperTwitter").hide(300);
          // if (signIn === 1) {
          //   firebase
          //     .auth()
          //     .currentUser.delete()
          //     .then((d) => {
          //       loginwithTwitter(r);
          //     });
          // } else {
          //   loginwithTwitter(r);
          // }
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
