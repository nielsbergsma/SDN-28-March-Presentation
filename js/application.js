(function() {
  'use strict';

  var application = angular.module("application", ["ngRoute", "controllers", "infrastructure"]);

  application.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/category-list.htm',
        controller: 'categoryListController'
      })
      .when('/categories/:category', {
        templateUrl: 'partials/product-list.htm',
        controller: 'productListController'
      })
      .when('/products/:category/:product', {
        templateUrl: 'partials/product-info.htm',
        controller: 'productDetailsController'
      })
      .otherwise({ 
        redirectTo: '/'
      });
  });

  application.run(function(notificationService) {
    notificationService.init();
  });
})();