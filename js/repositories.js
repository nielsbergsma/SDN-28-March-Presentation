'use strict';

(function() {
	var module = angular.module("repositories", ["model"]);

	module.service("lastViewedProductsRepository", function($q, $http) {
		var maxNumberOfItems = 3;
		var storageKey = "lastViewedProducts";

		this.add = function(product) {
			localforage.getItem(storageKey, function(products) {
				var products = products || [];

				products = products.filter(function(p) { 
					return !(p.category === product.category && p.product === product.product);
				});

				products.unshift(product);

				localforage.setItem(storageKey, products);
			});
		}

		this.listAsync = function() {
			var deferred = $q.defer();

			localforage.getItem(storageKey, function(data) {
				var products = (data || []).slice(0, maxNumberOfItems);
				deferred.resolve(products);
			});

			return deferred.promise;
		}
	});

	module.service("orderRepository", function($q, $http, model) {
		var storageKey = "order";

		this.set = function(order) {
			localforage.setItem(storageKey, order);
		}

		this.getAsync = function() {
			var deferred = $q.defer();

			localforage.getItem(storageKey, function(data) {
				var order = null;

				if (data) {
					order = model.orderFromJson(data);
				}
				else {
					order = model.createOrder();
				}

				deferred.resolve(order);
			});

			return deferred.promise;
		}

		this.purchase = function() {
			var deferred = $q.defer();

			localforage.getItem(storageKey, function(order) {
				if (!order) return;

				$http.post("/api/order", order)
					.then(function() {
						localforage.setItem(storageKey, model.createOrder());
						deferred.resolve();
					})
					.catch(function() {
						deferred.reject();
					});
			});

			return deferred.promise;
		}
	});
	
	module.service("productRepository", function($q, $http) {
		this.getProductCategoriesAsync = function() {
			var deferred = $q.defer();

			getOrFetchDataAsync()
				.then(function(data) {
					if (data === null) {
						deferred.resolve([]);
						return;
					}

					deferred.resolve(data.categories);
				});

			return deferred.promise;
		}

		this.getProductsByCategoryAsync = function(category) {
			var deferred = $q.defer();

			getOrFetchDataAsync()
				.then(function(data) {
					if (data === null) {
						deferred.resolve([]);
						return;
					}

					var products = data.categories
						.filter(function(c) { return c.name === category })
						.map(function(c) { return c.products })
						.reduce(function(l,r) { return l.concat(r) });

					deferred.resolve(products);
				});

			return deferred.promise;
		}

		this.getProductAsync = function(category, name) {
			var deferred = $q.defer();

			getOrFetchDataAsync()
				.then(function(data) {
					if (data === null) {
						deferred.resolve(null);
						return;
					}

					var products = data.categories
						.filter(function(c) { return c.name === category })
						.map(function(c) { return c.products })
						.reduce(function(l,r) { return l.concat(r) })
						.filter(function(p) { return p.name === name });

					deferred.resolve(products[0] || null);
				});

			return deferred.promise;
		}

		var getOrFetchDataAsync = function() {
			var fetch = function() {
				return new Promise(function(resolve, reject) {
					$http.get("/api/products")
						.success(resolve)
						.error(reject);
				})
			};

			return localforage.getOrFetch("products", fetch, 30000);
		}
	});
})();	