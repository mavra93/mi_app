'use strict';
angular.module('miApp').controller('LoginCtrl', function ($scope, $rootScope, Auth, $state, localStorageService) {

  $scope.user = {
    email: localStorageService.get("email") || null,
    password: ""
  };
  $scope.remember = true;
  $scope.login = () => {
    $scope.error = null;
    Auth.login($scope.user.email, $scope.user.password).then(data => {
      if ($scope.remember) {
        localStorageService.set("email", data.email);
      } else {
        localStorageService.set("email", "");
      }
      localStorageService.set("user", "logged_into");
      $state.go("app.dashboard");
    }).catch(error => {
      $scope.error = error.code;
    })
  };
});
