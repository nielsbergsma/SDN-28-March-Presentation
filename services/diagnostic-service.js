'use strict';

var service = require("./service");
var http = service.create("diagnostic-service"); 
var messages = [];

process.title = "diagnostic-service";

http.post("/", function(req, res) {
	console.log(req.body);
	var message = req.body;
	messages.push(message);
	res.send(201);
});

http.get("/", function(req, res) {
	res.json(messages);
});