$(document).ready(function(){
    console.log('Main Script Document is ready');
    setTimeout(function(){
        console.log('Time out called');
        $('#hellopreloader').fadeOut(1000);
    }, 1000);

    $('#facebookLogin').click(function(){
    	console.log('Clicked');
		  var provider = new firebase.auth.FacebookAuthProvider();
		  firebase.auth().signInWithPopup(provider).then(r=>{
		  	console.log('Success: ', r);
		  }).catch(e=>{
		  	console.log('Error: ', e);
		  })
    });
});