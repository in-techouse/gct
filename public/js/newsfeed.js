function gettweets() {
    $.ajax({
        url: "/user/tweets",
        type: "GET",

        success: function (data) {
            console.log("Success: ", data);
            if (data!== "-1"){
                console.log("tweets: ", data.t);
                let tweets=data.t;
                tweets.forEach(tweet  => {
                    console.log("tweet: " , tweet);
$("#newsfeed-items-grid").append("<p>hello world </p>");
                    
                });
            }
            else{
                window.location.reload();
            }

        },
        error: function (error) {
            console.log("Error:", error);

        }
    });


}

$(document).ready(function () {
    console.log("newsfeed document is ready");
    gettweets();
});