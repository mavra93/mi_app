"use strict";
angular.module("miApp").controller("EditAccountCtrl", function ($scope, UserService, $state, userData) {
  $scope.language = UserService.getLanguage();
  $scope.posts = [];
  $scope.userProfile = angular.copy(userData);
  $scope.updateProfile = () => {
    UserService.updateProfile($scope.userProfile).then(() => {
      UserService.setUser($scope.userProfile);
      UserService.storeUsers();
      $state.go("app.user", {user: $scope.userProfile});
    })
  };

  $scope.uploadImage = () => {
    UserService.getProfileImage().then((image) => {
      $scope.userProfile.photoURL = image;
    })
  };

  $scope.changeLanguage = (language) => {
    $scope.language = language;
    UserService.setLanguage(language);
  }

});
