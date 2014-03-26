'use strict';

(function() {
	var module = angular.module("model", []);

	module.factory("model", function() {
		return {
			createOrder: function() {
				return new Order();
			},

			orderFromJson: function(data) {
				data.__proto__ = new Order();
				return data;
			}
		}
	});

	function Order() {
		this.lines = [];
	}

	Order.prototype.addLine = function(product, quantity) {
		var line = this.lines.filter(function(l) { 
			return l.product.product === product.product && l.product.category === product.category
		})[0];

		if (line) {
			line.quantity += quantity;
		}
		else {
			line = new OrderLine(product, quantity)
			this.lines.push(line);
		}
	}

	Order.prototype.total = function() {
		return this.lines.reduce(function(sum, line) {
			return sum + line.quantity * line.product.price;
		}, 0);
	}

	function OrderLine(product, quantity) {
		this.product = product;
		this.quantity = quantity;
	}
})();