'use strict';

var service = require("./service");
var http = service.create("clientid-generator-service"); 
var id = +new Date;

process.title = "clientid-generator-service";

http.get("/id", function(req, res) {
	res.json({ id: id });
	id++;
});
