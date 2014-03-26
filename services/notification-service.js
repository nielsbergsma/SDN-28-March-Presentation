'use strict';

var service = require("./service");
var requestify = require('requestify'); 
var http = service.create("notification-service"); 
var notificationsPerClient = {};

process.title = "notification-service";

http.post("/:clientid", function(req, res) {
	var clientId = req.params.clientid;
	var message = req.body;
	var notifications = notificationsPerClient[clientId];

	if (!notifications) {
		notifications = [];
		notificationsPerClient[clientId] = notifications;
	}

	console.log("Notification enqueued for " + clientId, message);
	notifications.push(message);
	
	res.send(201);
});

http.get("/", function(req, res) {
	res.json(notificationsPerClient);
	notificationsPerClient = {};
});

http.get("/:clientid", function(req, res) {
	var clientId = req.params.clientid;
	var notifications = notificationsPerClient[clientId] || [];

	res.json(notifications);
	delete notificationsPerClient[clientId];
});