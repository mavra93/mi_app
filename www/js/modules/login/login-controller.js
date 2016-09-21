'use strict';
angular.module('miApp').controller('LoginCtrl', function ($scope, Auth, $state) {
  $scope.user = {
    email: "",
    password: ""
  };
  $scope.login = () => {
    $scope.error = null;
    Auth.login($scope.user.email, $scope.user.password).then(() => {
      $state.go("dashboard");
    }).catch(error => {
      $scope.error = error.code;
    })
  };

});
