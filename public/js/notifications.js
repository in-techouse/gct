const notificationUser = JSON.parse(localStorage.getItem("user"));
const notifications = [];
$(document).ready(function () {
  console.log("Notification Document is ready");
  var starCountRef = firebase
    .database()
    .ref()
    .child("Notifications")
    .orderByChild("ownerId")
    .equalTo(notificationUser.id);
  starCountRef.on("value", function (snapshot) {
    let count = 0;
    $("#notificationCount").text("");
    $("#notificationCount").fadeOut(500);
    $("#notificationList").empty();
    snapshot.forEach((noti) => {
      const notification = noti.val();
      if (!notification.read) {
        count++;
      }
      if (count > 0) {
        $("#notificationCount").text(count);
        $("#notificationCount").fadeIn(500);
      }
      notifications.push(notification);
      insertNotificationToDisplay(notification);
    });
  });
});

function insertNotificationToDisplay(notification) {
  let profileUrl = "";
  if (notification.userId === notificationUser.id) {
    profileUrl = "/userProfile/profile";
  } else {
    profileUrl = "/userFriend/friendProfile?id=" + notification.userId;
  }
  let notiClass = "";
  if (!notification.read) {
    notiClass = "un-read";
  }
  let content = `
    <li class="${notiClass}">
        <div class="author-thumb">
            <img src="${notification.userImg}" alt="author">
        </div>
        <div class="notification-event">
            <div>
                <a href="${profileUrl}" class="h6 notification-friend">${
    notification.userName
  }</a> 
                ${notification.notificatonText} 
                <a href="/user/showPost?id=${
                  notification.postId
                }" class="notification-link">profile status</a>.
            </div>
            <span class="notification-date">
                <time class="entry-date updated" datetime="2004-07-24T18:18">${getTimeDifference(
                  notification.timeStamps
                )}</time>
            </span>
        </div>
    </li>
    `;

  $("#notificationList").prepend(content);
}

function markedAsRead() {
  console.log("Mark all notification read for user: ", notificationUser);
  notifications.forEach((noti) => {
    firebase
      .database()
      .ref()
      .child("Notifications")
      .child(noti.id)
      .child("read")
      .set(true);
  });
}
