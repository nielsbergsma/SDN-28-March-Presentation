"use strict";

var requestify = require('requestify'); 
var express = require("express");

var corsFilter = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

//for demo purposes lets assume this will always succeed
//returns a http server
function createService(serviceName, port) {
	var http = express();
	http.use(express.bodyParser());
	http.use(corsFilter);

	if (port > 0) {
		http.listen(port);
		console.log("Info: " + serviceName + " is up and running at port " + port);
	}
	else {
		requestify
			.put("http://127.0.0.1:5000/register/" + serviceName)
			.then(function(response) {
				var port = response.getBody().port;

				http.listen(port);
				console.log("Info: " + serviceName + " is up and running at port " + port);
			});
	}

	return http;
}

function sendNotification(clientId, message) {
	return requestify
		.get("http://127.0.0.1:5000/locate/notification-service")
		.then(function(response) {
			var location = response.getBody();
			return requestify.post(location.url + "/" + clientId, message);
		});
}

function sendDiagnosticMessage(message) {
	return requestify
		.get("http://127.0.0.1:5000/locate/diagnostic-service")
		.then(function(response) {
			var location = response.getBody();
			return requestify.post(location.url + "/", message);
		});
}

function locate(serviceName, req, res) {
	return requestify
		.get("http://127.0.0.1:5000/locate/" + serviceName)
		.then(function(response) {
			return response.getBody().url;
		});
}

module.exports.create = createService;
module.exports.notifyClient = sendNotification;
module.exports.report = sendDiagnosticMessage;
module.exports.locate = locate;