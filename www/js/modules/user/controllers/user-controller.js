"use strict";
angular.module("miApp").controller("UserCtrl", function ($scope, UserService, $state) {
  UserService.getCurrentUser().then(user => {
    $scope.userProfile = angular.copy(user);
    UserService.loadUserPosts(user).then(posts => {
      $scope.posts = posts;
    });
  }).catch(err => {

  });


});
