(function() { 
  "use strict";
  var module = angular.module("controllers", ["applicationServices"]);

  module.controller("notificationWidget", function($scope) {
    $scope.enabled = Notification.permission === "granted";

    $scope.requestPermission = function() {
      Notification.requestPermission(function() {
        $scope.enabled = Notification.permission === "granted";
        $scope.$apply()
      }.bind(this));
    }

    $scope.$on("newNotification", function(event, message) {
      new Notification(message, { icon: "/img/bell.png" });
    });
  });

  module.controller("categoryListController", function($scope, productService) {
      productService
        .getProductCategoriesAsync()
        .then(function(categories) {
          $scope.categories = categories;
        });
  });

  module.controller("productListController", function($scope, $routeParams, productService) {
    $scope.category = $routeParams.category;

    productService
      .getProductsByCategoryAsync($routeParams.category)
      .then(function(products) {
        $scope.products = products;
      });
  }); 

  module.controller("productDetailsController", function($scope, $routeParams, productService, shoppingCartService) {
    $scope.category = $routeParams.category;
    $scope.product = $routeParams.product;
    $scope.quantity = "1";
    $scope.addToCart = function(product, quantity) {
      shoppingCartService.add(product, parseInt(quantity));
    };

    $scope.formatAsPrice = function(price) {
      var value = (Math.round(price * 100) / 100).toString();
      value += value % 1 == 0 ? ".00" : "";
      return value;
    }

    productService
      .getProductAsync($routeParams.category, $routeParams.product)
      .then(function(info) {
        $scope.info = info;
      });
  }); 

  module.controller("lastViewedProductsController", function($scope, productService) {
    $scope.products = [];

    productService.getLastViewedProductsAsync()
      .then(function(products) {
      $scope.products = products
    });
  });

  module.controller("shoppingCartController", function($scope, shoppingCartService) {
    shoppingCartService.getAsync()
      .then(function(order) {
        $scope.order = order;
      });

      $scope.$on("shoppingCartChanged", function() {
        shoppingCartService.getAsync()
          .then(function(order) {
            $scope.order = order;
          });
      });

      $scope.formatAsPrice = function(price) {
        var value = (Math.round(price * 100) / 100).toString();
        value += value % 1 == 0 ? ".00" : "";
        return value;
      }

      $scope.purchase = function() {
        shoppingCartService.purchaseAsync()
          .catch(function() {
              new Notification("The purchase could not be completed, please try again later", { icon: "/img/bell.png" });
          }); 
      };
  });
})();