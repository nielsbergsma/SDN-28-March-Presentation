'use strict';

var service = require("./service");
var http = service.create("product-service"); 

process.title = "product-service";

http.get("/", function(req, res) {
	res.json({ categories: [{ 
		name: "Red socks", 
		img: "/img/red-sock-thumb.png",
		products: [
			{ name: "Size S", price: 0.99, img: "/img/red-sock-thumb.png" },
			{ name: "Size M", price: 1.99, img: "/img/red-sock-thumb.png" },
			{ name: "Size L", price: 2.99, img: "/img/red-sock-thumb.png" }
		]
	}, { 
		name: "Blue socks", 
		img: "/img/blue-sock-thumb.png",
		products: [
			{ name: "Size S", price: 0.99, img: "/img/blue-sock-thumb.png" },
			{ name: "Size M", price: 1.99, img: "/img/blue-sock-thumb.png" },
			{ name: "Size L", price: 2.99, img: "/img/blue-sock-thumb.png" }
		]
	}]
	});
});