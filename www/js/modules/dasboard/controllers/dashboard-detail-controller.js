"use strict";
angular.module("miApp").controller("DashboardDetailCtrl", function ($scope, $state) {
  $scope.post = $state.params.post;
});
