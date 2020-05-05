// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAFSBuiVUoFC18qzI3xd3EsGL_Fsy4y5VA",
  authDomain: "global-ct.firebaseapp.com",
  projectId: "global-ct",
  messagingSenderId: "559718967029",
  appId: "1:559718967029:web:6cd2b538b1fe3d940dc7bc",
  measurementId: "G-H4442SC9K6",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

function loginwithTwitter(d) {
  $.ajax({
    url: "/twitterLogin",
    type: "POST",
    data: {
      accessToken: d.credential.accessToken,
      secret: d.credential.secret,
    },
    success: function (data) {
      console.log("Success: ", data);
      if (data == "-1") {
        $("#upperTwitter").show(300);
        $("#mainError").show(300);
      } else if (data == "2") {
        // window.location.reload();
        $("#username").show(300);
      } else if (data == "3") {
        window.location.reload();
      }
      $("#loading").hide(300);
      $("#mainAuth").show(300);
    },
    error: function (error) {
      console.log("Error:", error);
      $("#upperTwitter").show(300);
      $("#mainError").show(300);
    },
  });
}

function loginWithFacebook(d) {
  $.ajax({
    url: "/facebookLogin",
    type: "POST",
    data: {
      accessToken: d.credential.accessToken,
    },
    success: function (data) {
      console.log("Success: ", data);
      if (data == "-1") {
        $("#upperFacebook").show(300);
        $("#mainError").show(300);
      } else if (data == "2") {
        window.location.reload();
        $("#username").show(300);
      } else if (data == "3") {
        window.location.reload();
      }
      $("#loading").hide(300);
      $("#mainAuth").show(300);
    },
    error: function (error) {
      console.log("Error:", error);
      $("#mainError").show(300);
    },
  });
}

$(document).ready(function () {
  console.log("Main Script Document is ready");
  setTimeout(function () {
    console.log("Time out called");
    $("#hellopreloader").fadeOut(1000);
  }, 1000);

  $("#facebookLogin").click(function () {
    console.log("Clicked");
    $("#mainError").hide(300);
    $("#loading").show(300);
    $("#mainAuth").hide(300);
    let signIn = 1;
    if (firebase.auth().currentUser === null) {
      signIn = 0;
    }
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((r) => {
        console.log("Success: ", r);
        $("#upperFacebook").hide(300);
        if (signIn === 1) {
          firebase
            .auth()
            .currentUser.delete()
            .then((d) => {
              loginWithFacebook(r);
            });
        } else {
          loginWithFacebook(r);
        }
      })
      .catch((e) => {
        console.log("Error: ", e);
        $("#mainError").show(300);
        $("#loading").hide(300);
        $("#mainAuth").show(300);
      });
  });

  $("#twitterLogin").click(function () {
    console.log("Clicked");
    $("#mainError").hide(300);
    $("#loading").show(300);
    $("#mainAuth").hide(300);
    let signIn = 1;
    if (firebase.auth().currentUser === null) {
      signIn = 0;
    }
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((r) => {
        console.log("Success: ", r);
        $("#upperTwitter").hide(300);
        if (signIn === 1) {
          firebase
            .auth()
            .currentUser.delete()
            .then((d) => {
              loginwithTwitter(r);
            });
        } else {
          loginwithTwitter(r);
        }
      })
      .catch((e) => {
        console.log("Twitter Error: ", e);
        $("#mainError").show(300);
        $("#loading").hide(300);
        $("#mainAuth").show(300);
      });
  });
});
