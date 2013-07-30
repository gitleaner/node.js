var localStream, localPeerConnection, remotePeerConnection, remoteStream;

var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");

var startButton = document.getElementById("startButton");
var callButton = document.getElementById("callButton");
var hangupButton = document.getElementById("hangupButton");

startButton.disabled=false;
callButton.disabled=true;
hangupButton.disabled=true;

startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;

function trace(text) {
  console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}

function gotRemoteStream(event){
  remoteVideo.src = URL.createObjectURL(event.stream);
  remoteStream = event.stream;
  trace("Received remote stream");
}

function gotStream(stream){
  trace("Received local stream");
  localVideo.src = URL.createObjectURL(stream);
  localStream = stream;
  callButton.disabled = false;
}

function start()
{
	trace("Requesting local stream");
	startButton.disabled=true;
	var constraints = {audio: true, video: true};
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	navigator.getUserMedia(constraints, gotStream, function(error) { 
							trace("navigator.getUserMedia error : ", error); }
						  );
}

function call()
{
	callButton.disabled = true;
	hangupButton.disabled = false;
	trace("Starting Call");
	
	if (localStream.getVideoTracks().length > 0) {
    	trace('Using video device: ' + localStream.getVideoTracks()[0].label);
  	}
  	if (localStream.getAudioTracks().length > 0) {
    	trace('Using audio device: ' + localStream.getAudioTracks()[0].label);
 	}	
 	
 	var servers = null;
 	
 	localPeerConnection = new webkitRTCPeerConnection(servers);
 	trace("Created local peer connection object localPeerConnection");
 	localPeerConnection.onicecandidate = gotLocalIceCandidate;

 	remotePeerConnection = new webkitRTCPeerConnection(servers);
  	trace("Created remote peer connection object remotePeerConnection");
	remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
	remotePeerConnection.onaddstream = gotRemoteStream;
	
	localPeerConnection.addStream(localStream);
  	trace("Added localStream to localPeerConnection");
  	localPeerConnection.createOffer(gotLocalDescription);
}

function hangup()
{
	trace("Ending call");
  	localPeerConnection.close();
  	remotePeerConnection.close();
  	localPeerConnection = null;
  	remotePeerConnection = null;
  	hangupButton.disabled = true;
  	callButton.disabled = false;
}

function gotLocalIceCandidate(event){
  if (event.candidate) {
    remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    trace("Local ICE candidate: \n" + event.candidate.candidate);
  }
}

function gotRemoteIceCandidate(event){
  if (event.candidate) {
    localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
    trace("Remote ICE candidate: \n " + event.candidate.candidate);
  }
}

function gotLocalDescription(description){
  localPeerConnection.setLocalDescription(description);
  trace("Offer from localPeerConnection: \n" + description.sdp);
  remotePeerConnection.setRemoteDescription(description);
  remotePeerConnection.createAnswer(gotRemoteDescription);
}

function gotRemoteDescription(description){
  remotePeerConnection.setLocalDescription(description);
  trace("Answer from remotePeerConnection: \n" + description.sdp);
  localPeerConnection.setRemoteDescription(description);
}