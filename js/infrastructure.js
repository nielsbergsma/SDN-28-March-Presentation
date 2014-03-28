(function() {
	'use strict';

    var WebSocket = window.WebSocket || window.MozWebSocket;
	var module = angular.module("infrastructure", []);

	module.service("notificationService", function($q, $http, $rootScope) {

		this.init = function() {
			var self = this;

			this.getClientIdAsync()
				.then(function(clientId) {
					$http.defaults.headers.common["Client-Id"] = clientId;

					var connection = new ReconnectingWebSocket('ws://127.0.0.1:8080');
			        connection.onopen = function() {
			        	connection.send(JSON.stringify({ notificationClientId: clientId }));
			        }

			        connection.onmessage = function (message) {
			        	var data = JSON.parse(message.data);
			        	$rootScope.$broadcast("newNotification", data.message);
			        };
				});
		}

		this.getClientIdAsync = function() {
			return new Promise(function(resolve, reject) {
				localforage.getItem("clientId", function(clientId) {
					if (isNaN(clientId)) {
						$http.get("http://localhost:8080/api/clientid")
							.then(function(response) {
								clientId = response.data.id;
								localforage.setItem("clientId", clientId);
								resolve(clientId);
							});
					}
					else {
						resolve(clientId);
					}
				});
			});
		}
	});
})()