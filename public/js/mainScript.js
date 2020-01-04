$(document).ready(function(){
    console.log('Main Script Document is ready');
    setTimeout(function(){
        console.log('Time out called');
        $('#hellopreloader').fadeOut(1000);
    }, 1000);
});