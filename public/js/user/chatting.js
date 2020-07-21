const chattingUser = JSON.parse(localStorage.getItem("user"));
let friend = null;
let friendId = "";
let chatId = "";
let messages = [];
let messageRef = null;
function loadFriendDetail(id) {
  $(".about-olympususerChatBoxList").empty();
  $(".userChatBoxList").fadeOut(500);
  $(".loadingChat").fadeIn(500);
  friendId = $("#friendId").val();
  console.log("Friend Id is: ", friendId);
  chatId = "";
  let count =
    friendId.length > chattingUser.id.length
      ? friendId.length
      : chattingUser.id.length;

  for (let i = 0; i < count; i++) {
    let fAscii = friendId.length > i ? friendId.charCodeAt(i) : 0;
    let uAscii = chattingUser.id.length > i ? chattingUser.id.charCodeAt(i) : 0;
    let asciiSum = fAscii + uAscii;
    chatId = chatId + asciiSum;
  }
  console.log("Chat Id is: ", chatId);
  $(".userMessageBox1").prop("disabled", true);
  $(".userMessageBox2").prop("disabled", true);
  firebase
    .database()
    .ref()
    .child("Users")
    .child(id)
    .once("value")
    .then((f) => {
      friend = f.val();
      console.log("Friend is: ", friend);
      loadPreviousChat();
    });
}

function loadPreviousChat() {
  firebase
    .database()
    .ref()
    .child("Chats")
    .child(chatId)
    .once("value")
    .then((data) => {
      data.forEach((m) => {
        if (m.val().userId === chattingUser.id) {
          // user's message
          setUserMessage(m.val());
        } else {
          // Friend's message
          setFriendMessage(m.val());
          messages.push(m.val());
        }
      });
      $(".mCustomScrollbar").animate(
        {
          scrollTop: $(".userChatBoxList").height(),
        },
        1000
      );
      $(".userChatBoxList").fadeIn(500);
      $(".loadingChat").fadeOut(500);
      $(".userMessageBox1").prop("disabled", false);
      $(".userMessageBox2").prop("disabled", false);
      listenToMessages();
    })
    .catch((e) => {
      $(".userChatBoxList").fadeIn(500);
      $(".loadingChat").fadeOut(500);
      $(".userMessageBox1").prop("disabled", false);
      $(".userMessageBox2").prop("disabled", false);
    });
}

function listenToMessages() {
  messageRef = firebase
    .database()
    .ref()
    .child("Chats")
    .child(chatId)
    .orderByChild("userId")
    .equalTo(friendId);
  messageRef.on("value", function (snapshot) {
    const maxTimeStamps = Math.max.apply(
      Math,
      messages.map(function (o) {
        return o.timeStamps;
      })
    );
    let playSound = false;
    snapshot.forEach((m) => {
      if (m.val().timeStamps > maxTimeStamps) {
        playSound = true;
        messages.push(m.val());
        setFriendMessage(m.val());
      }
    });
    if (playSound) {
      // Apply Sound Setting
      console.log("Chatting, Final Sound Setting is: ", finalSoundSettings);
      if (
        finalSoundSettings.chatSound === null ||
        finalSoundSettings.chatSound === undefined ||
        finalSoundSettings.chatSound === "on"
      ) {
        $("#sound_tag")[0].play();
      }
      $(".mCustomScrollbar").animate(
        {
          scrollTop: $(".userChatBoxList").height(),
        },
        1000
      );
    }
  });
}

function setUserMessage(m) {
  let messageContent = `
    <li>
        <div class="author-thumb" style="float: right; width: 36px; height: 36px;">
            <img src="${
              chattingUser.image
            }" alt="author" class="mCS_img_loaded" style="width: 36px; height: 36px; margin-left: 11px;">
        </div>
        <div class="notification-event" style="float: right;">
            <span class="chat-message-item" style="float: right; color: #FFFFFF; background-color: #7c5ac2; width: 100%;">
                ${m.message}
            </span>
            <span class="notification-date">
                <time class="entry-date updated" datetime="2004-07-24T18:18">
                    ${getChatTimeDifference(m.timeStamps)}
                </time>
            </span>
        </div>
    </li>
  `;
  $(".userChatBoxList").append(messageContent);
}

function setFriendMessage(m) {
  let messageContent = `
    <li>
        <div class="author-thumb">
            <img src="${
              friend.image
            }" alt="author" class="mCS_img_loaded" style="width: 36px; height: 36px; margin-left: -10px;">
        </div>
        <div class="notification-event">
            <span class="chat-message-item">
                ${m.message}
            </span>
            <span class="notification-date">
                <time class="entry-date updated" datetime="2004-07-24T18:18">
                    ${getChatTimeDifference(m.timeStamps)}
                </time>
            </span>
        </div>
    </li>
  `;
  $(".userChatBoxList").append(messageContent);
}

$(document).ready(function () {
  $(".userMessageBox1").on("keypress", function (e) {
    if (e.which === 13) {
      const message = $(".userMessageBox1").val().trim();
      if (message.length > 0) {
        sendMessage(message);
        return false;
      }
    }
  });

  $(".userMessageBox2").on("keypress", function (e) {
    if (e.which === 13) {
      const message = $(".userMessageBox2").val().trim();
      if (message.length > 0) {
        sendMessage(message);
        return false;
      }
    }
  });

  $(".js-chat-open").click(function () {
    if (messageRef !== null) {
      messageRef.off("value");
    }
    $(".popup-chat-responsive").removeClass("open-chat");
  });
});

function sendMessage(message) {
  let timeStamps = parseInt(moment().format("X"));
  let formattedTime = moment().format("ddd, Do, MMM-YYYY hh:mm A");
  let id = firebase.database().ref().child("Chats").child(chatId).push().key;
  let messageObject = {
    id,
    timeStamps,
    formattedTime,
    message,
    userId: chattingUser.id,
    friendId,
  };
  setUserMessage(messageObject);
  $(".mCustomScrollbar").animate(
    {
      scrollTop: $(".userChatBoxList").height(),
    },
    1000
  );
  $(".userMessageBox1").val("");
  $(".userMessageBox2").val("");
  firebase
    .database()
    .ref()
    .child("Chats")
    .child(chatId)
    .child(messageObject.id)
    .set(messageObject);
}

function getChatTimeDifference(timeStamps) {
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
