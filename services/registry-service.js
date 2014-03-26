'use strict';

var service = require("./service");
var http = service.create("registry-service", 5000); 
var nextPort = 5311;
var services = { };

process.title = "registry-service";

//idea: may be it would be nicer if all services would be discoverable through DNS (load balancing?)
//idea: discover server forwards (poxies) request to target (+load balances)
//idea: broadcast data to clients, so data would never be lost
http.put("/register/:name", function(req, res) {
	var serviceName = req.params.name;

	if (!serviceName) {
		res.send(400);
	}
	else {
		var url = "http://" + req.ip + ":" + nextPort;
		services[serviceName] = url;

		res.json({  
			hostname: req.ip, 
			port: nextPort, 
			url: url 
		});

		console.log("Registering service " + serviceName + " at " + url);
		nextPort++;
	}
});

http.get("/locate/:name", function(req, res) {
	var serviceName = req.params.name;
	var serviceUrl = services[serviceName];

	if (!serviceUrl) {
		res.send(404);
	}
	else {
		res.json({ name: serviceName, url: serviceUrl });
	}
});