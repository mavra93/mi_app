"use strict";
angular.module("miApp").controller("UserCtrl", function ($scope, UserService, $state, userData, newUserDara) {
  $scope.tab = 1;
  if (newUserDara) {
    $scope.userProfile = newUserDara;
  } else {
    $scope.userProfile = userData;
  }
  UserService.loadUserPosts($scope.userProfile).then(posts => {
    $scope.posts = posts;
  });

  $scope.changeTab = (tab) => {
    $scope.tab = tab;
  }
});
