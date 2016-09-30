"use strict";
angular.module("miApp").controller("EditAccountCtrl", function ($scope, UserService, $state) {

  UserService.getCurrentUser().then(user => {
    $scope.userProfile = angular.copy(user);
  }).catch(err => {

  });
  $scope.updateProfile = () => {
    UserService.updateProfile($scope.userProfile).then(() => {
      UserService.setUser($scope.userProfile);
      $state.go("app.user", {user: $scope.userProfile});
    })
  };

  $scope.uploadImage = () => {
    UserService.getProfileImage().then((image) => {
      $scope.userProfile.photoURL = image;
    })
  };
});
