'use strict';

var service = require("./service");
var http = service.create("shipment-service"); 

process.title = "shipment-service";

http.post("/package-and-ship/:orderId", function(req, res) {
	var clientId = req.headers["client-id"] || "0";
	var order = req.body;

	service.report({ source: "shipment-service", type: "info", message: "Started packaging order " + order.id });
	service.report({ source: "shipment-service", type: "info", message: "Completed packaging order " + order.id });
	service.report({ source: "shipment-service", type: "info", message: "Started shipment request for order " + order.id });
	service.notifyClient(clientId, { message: "Your is order is packed and is been shipped (#" + order.id + ")" });
	service.report({ source: "shipment-service", type: "info", message: "Completed shipment request for order " + order.id });

	setTimeout(function() {
		res.send(201);
	}, 2000);
});