'use struct';

var WebSocketServer = require('websocket').server;
var Promise = require('promise');
var requestify = require('requestify'); 
var express = require("express");
var pathUtils = require("path");

var http = express();
var server = http.listen(8080);
var wsServer = new WebSocketServer({ httpServer: server });
var notificationConnections = { }

process.title = "dispatcher-service"; 

http.use(express.bodyParser());

http.get("/api/clientid", function(req, res) {
	forwardTo("clientid-generator-service", "/id", req, res);
});

http.get("/api/products", function(req, res) {
	forwardTo("product-service", "/", req, res);
});

http.get("/diagnostics", function(req, res) {
	forwardTo("diagnostic-service", "/", req, res);
});

http.post("/api/order", function(req, res) {
	forwardTo("order-service", "/", req, res);
});

http.get("*", function (req, res) {
	var versionMarkDetected = false;
	var path = req.url.split("?")[0].substring(1);

	if (path === "" || path === "/") {
		path = "index.htm";
	}

	res.sendfile(pathUtils.resolve("../" + path));
});

//set up web socket handlers
wsServer.on("request", function(request) {
    var connection = request.accept(null, request.origin);
    var send = function(o) { connection.sendUTF(JSON.stringify(o)) };

    connection.on("message", function(message) {
    	var data = JSON.parse(message.utf8Data);
    	var notificationClientId = data.notificationClientId;

		notificationConnections[notificationClientId] = send;

		getQueuedNotificationsAsync(data.notificationClientId)
			.then(function(messages) {
				messages.forEach(send);
			});
    });
});

//set up sync: notification services <-> web socket servers
setInterval(function() {
	getQueuedNotificationsAsync("")
		.then(function(messagesPerClient) {
			for (var client in messagesPerClient) {
				var send = notificationConnections[client];
				var messages = messagesPerClient[client];

				try {
					send && messages.forEach(send);
				}
				catch (exception) {
					//mmmmm...
				}
			}
		});
}, 1000);

//helpers
function forwardTo(serviceName, endpointPath, req, res) {
	requestify
		.get("http://127.0.0.1:5000/locate/" + serviceName)
		.then(function(response) {
			var location = response.getBody();

			if (req.method === "GET") {
				requestify
					.get(location.url + endpointPath)
					.then(function(response) { 
						res.json(response.getBody()) 
					})
					.catch(function() { res.send(500) });
			}
			else if (req.method === "POST") {
				var clientId = req.headers["client-id"] || "0";

				requestify
					.post(
						location.url + endpointPath, 
						req.body, 
						{ headers: { "client-id": clientId } }
					)
					.then(function() { 
						res.send(201);
					})
					.catch(function() { res.send(500) });
			}
		})
		.catch(function() { res.send(500) });
}

function getQueuedNotificationsAsync(clientId) {
	return new Promise(function (resolve, reject) {
		requestify
			.get("http://127.0.0.1:5000/locate/notification-service")
			.then(function(response) {
				var location = response.getBody();
				
				requestify
					.get(location.url + "/" + clientId)
					.then(function(response) {
						resolve(response.getBody());
					})
					.catch(reject);
			})
			.catch(reject);
	});
} 