'use strict';

angular.module('miApp').controller('SignupCtrl', function ($scope, $state, Auth) {
  $scope.user = {
    username: "",
    email: "",
    password: ""
  };

  $scope.signUp = function () {
    Auth.createUser($scope.user.username, $scope.user.email, $scope.user.password).then((user) => {
      Auth.setUser(user.uid, $scope.user.username, user.email);
      $state.go("dashboard");
    }).catch(error => {
      $scope.error = error.code;
    })
  }

});
