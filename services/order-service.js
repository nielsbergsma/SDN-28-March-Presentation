'use strict';

var service = require("./service");
var requestify = require('requestify'); 
var http = service.create("order-service"); 
var orderIdGenerator = +new Date;

process.title = "order-service";

http.post("/", function(req, res) {
	var clientId = req.headers["client-id"] || "0";
	var order = req.body;
	var orderId = ++orderIdGenerator;

	order.id = orderId;

	service.report({ source: "order-service", type: "info", message: "Received order, assigned id " + orderId });
	service.notifyClient(clientId, { message: "Order is being processed (#" + orderId + ")" });

	requestPaymentAsync(clientId, order)
		.then(function() { return requestShipmentAsync(clientId, order) })
		.then(function() {
			service.report({ source: "order-service", type: "info", message: "Completed order (#" + orderId + ")" });
			res.send(201);
		})
		.catch(function() {
			service.report({ source: "order-service", type: "info", message: "Failed to completed order (#" + orderId + ")" });
			res.send(500);
		});
});

function requestPaymentAsync(clientId, order) {
	return service.locate("payment-service")
		.then(function(serviceUrl) {
			return requestify.post(
				serviceUrl + "/charge/" + order.id, 
				order, 
				{ headers: { "client-id" : clientId } }
			)
		})
}

function requestShipmentAsync(clientId, order) {
	return service.locate("shipment-service")
		.then(function(serviceUrl) {
			return requestify.post(
				serviceUrl + "/package-and-ship/" + order.id, 
				order, 
				{ headers: { "client-id" : clientId } }
			)
		})
}
