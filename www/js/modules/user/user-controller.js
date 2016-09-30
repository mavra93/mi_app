"use strict";
angular.module("miApp").controller("UserCtrl", function ($scope, UserService, $state) {

  if ($state.params.user) {
    $scope.userProfile = $state.params.user;
  } else {
    UserService.getCurrentUser().then(user => {
      $scope.userProfile = angular.copy(user);
    }).catch(err => {
    });
  }
});
