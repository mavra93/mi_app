'use strict';
angular.module('miApp').controller('LoginCtrl', function ($scope, Auth, $state, localStorageService) {
  $scope.user = {
    email: localStorageService.get("email"),
    password: ""
  };
  $scope.remember = false;
  $scope.rememberMe = () => {
    $scope.remember = !$scope.remember;
  };
  $scope.login = () => {
    $scope.error = null;
    Auth.login($scope.user.email, $scope.user.password).then(data => {
      if ($scope.remember) {
        localStorageService.set("email", data.email);
      } else {
        localStorageService.set("email", "");
      }
      $state.go("app.dashboard");
    }).catch(error => {
      $scope.error = error.code;
    })
  };

});
