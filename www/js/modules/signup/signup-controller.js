'use strict';

angular.module('miApp').controller('SignupCtrl', function ($scope, $state, Auth, localStorageService) {
  $scope.user = {
    username: "",
    email: "",
    password: ""
  };

  $scope.signUp = function () {
    Auth.createUser($scope.user.email, $scope.user.password).then((user) => {
      Auth.setUser(user.uid, $scope.user.username, user.email);
      localStorageService.set("user", "logged_into");
      $state.go("app.dashboard", {'username': $scope.user.username});
    }).catch(error => {
      $scope.error = error.code;
    })
  }

});
