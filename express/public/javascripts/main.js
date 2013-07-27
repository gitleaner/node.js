navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints = {audio: false, video: true};
var video = document.querySelector("video");

function hasGetUserMedia() {
	return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

if (hasGetUserMedia())
{
	function successCallback(stream) {
  		window.stream = stream; // stream available to console
		if (window.URL) {
	    	video.src = window.URL.createObjectURL(stream);
	    } else {
    		video.src = stream;
  		}
		video.play();
	}

	function errorCallback(error){
	  console.log("navigator.getUserMedia error: ", error);
	}

	navigator.getUserMedia(constraints, successCallback, errorCallback);
} else {
	alert ('getUserMedia() is not supported in your browser');
}