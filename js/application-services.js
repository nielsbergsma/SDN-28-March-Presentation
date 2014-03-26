'use strict';

(function() {
	var module = angular.module("applicationServices", ["repositories", "model"]);

	module.service("productService", function(productRepository, lastViewedProductsRepository) {
		this.getProductCategoriesAsync = productRepository.getProductCategoriesAsync;
		this.getProductsByCategoryAsync = productRepository.getProductsByCategoryAsync;

		this.getProductAsync = function(category, product)  {
			lastViewedProductsRepository.add({ "category": category, "product": product });
			return productRepository.getProductAsync(category, product);
		}

		this.getLastViewedProductsAsync = lastViewedProductsRepository.listAsync;
	});

	module.service("shoppingCartService", function($q, $rootScope, model, orderRepository) {
		var currentOrder = model.createOrder();

		orderRepository.getAsync()
			.then(function(order) {
				currentOrder = order;
				$rootScope.$broadcast("shoppingCartChanged");
			});

		this.add = function(product, quantity) {
console.log(arguments);

			currentOrder.addLine(product, quantity);
			orderRepository.set(currentOrder);
			$rootScope.$broadcast("shoppingCartChanged");
		}

		this.getAsync = function() {
			var deferred = $q.defer();
			deferred.resolve(currentOrder);
			return deferred.promise;
		}

		this.purchaseAsync = function() {
			return orderRepository.purchase()
				.then(function() {
					currentOrder = model.createOrder();
					$rootScope.$broadcast("shoppingCartChanged");
				});
		}
	});
})();