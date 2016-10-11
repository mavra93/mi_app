"use strict";
angular.module("miApp").controller("DashboardDetailCtrl", function ($scope, $rootScope, $state) {
  if ($state.params.post) {
    $scope.post = $state.params.post;
  } else {
    $scope.post = $rootScope.transitions["app.dashboard"].params.post;
  }
});
