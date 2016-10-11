"use strict";
angular.module("miApp").controller("UserCtrl", function ($scope, UserService, $state, userData) {
  $scope.tab = 1;
  if ($state.params.user) {
    $scope.userProfile = $state.params.user;
  } else {
    $scope.userProfile = userData;
  }
  UserService.loadUserPosts($scope.userProfile).then(posts => {
    $scope.posts = posts;
  });

  $scope.changeTab = (tab) => {
    $scope.tab = tab;
  };

  $scope.postDetails = (post) => {
    $state.go("app.dashboardDetail", {post: post});
  };

});
