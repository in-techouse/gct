// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAFSBuiVUoFC18qzI3xd3EsGL_Fsy4y5VA",
  authDomain: "global-ct.firebaseapp.com",
  databaseURL: "https://global-ct.firebaseio.com",
  projectId: "global-ct",
  storageBucket: "global-ct.appspot.com",
  messagingSenderId: "559718967029",
  appId: "1:559718967029:web:6cd2b538b1fe3d940dc7bc",
  measurementId: "G-H4442SC9K6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
function loginwithTwitter() {
  $.ajax({
    url: '/twitterLogin',
    type: 'POST',
    data: {
      val: 1,
    },
    success: function (data) {
      alert('done' + data);
    },
    error: function (error) {
      console.log('Error:', error);
      // alert('error');
    }
  });
}

function loginWithFacebook() {
  $.ajax({
    url: '/facebookLogin',
    type: 'POST',
    data: {
      val: 1,
    },
    success: function (data) {
      alert('done' + data);
    },
    error: function (error) {
      console.log('Error:', error);
      // alert('error');
    }
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
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(r => {
        console.log("Success: ", r);
        loginWithFacebook();
      })
      .catch(e => {
        console.log("Error: ", e);
      });
  });

  $("#twitterLogin").click(function () {
    console.log("Clicked");
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(r => {
        console.log("Success: ", r);
        loginwithTwitter();
      })
      .catch(e => {
        console.log("Error: ", e);
      });
  });
});
