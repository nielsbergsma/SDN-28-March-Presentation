'use strict';

var service = require("./service");
var http = service.create("payment-service"); 

process.title = "payment-service";

http.post("/charge/:orderId", function(req, res) {
	var clientId = req.headers["client-id"] || "0";
	var order = req.body;

	service.report({ source: "payment-service", type: "info", message: "Started payment request for order " + order.id });
	service.notifyClient(clientId, { message: "Your credit card is charged for order " + order.id });
	service.report({ source: "payment-service", type: "info", message: "Completed payment request for order " + order.id });

	setTimeout(function() {
		res.send(201);
	}, 2500);
});