var http=require("http");
var url=require("url");

function start(route, handle) {
	function onRequest (request, response)
	{		
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received");
		
		route(pathname, handle, response, request);
	}
	
	http.createServer(onRequest).listen(8888);
	console.log("Server Started");
}

exports.start = start;

