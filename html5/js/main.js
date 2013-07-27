function hasGetUserMedia() {
  // Note: Opera is unprefixed.
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

if (hasGetUserMedia()) {
  var onFailSoHard = function(e) {
    console.log('Reeeejected!', e);
  };

  // Not showing vendor prefixes.
  navigator.getUserMedia({video: false, audio: true}, function(localMediaStream) {
    var video = document.querySelector('video');
    window.stream = stream; // stream available to console
  	if (window.URL) {
  		console.log("Coming here 2");
    	video.src = window.URL.createObjectURL(stream);
  	} else {
  		console.log("Coming here");
    	video.src = stream;
  	}
  }, onFailSoHard);
} 
else {
  alert('getUserMedia() is not supported in your browser');
}