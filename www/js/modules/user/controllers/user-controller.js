"use strict";
angular.module("miApp").controller("UserCtrl", function ($scope, UserService, $state, userData, $ionicModal) {
  $scope.tab = 1;
  if ($state.params.user) {
    $scope.userProfile = $state.params.user;
  } else {
    $scope.userProfile = userData;
  }
  UserService.loadUserPosts($scope.userProfile).then(data => {
    $scope.posts = data.posts;
    $scope.images = data.images;
  });

  $scope.changeTab = (tab) => {
    $scope.tab = tab;
  };

  /**
   Post details modal
   */

  $ionicModal.fromTemplateUrl("templates/modules/dashboard/dashboardDetail_template.html", {
    scope: $scope,
    animation: 'no-animation'
  }).then(modal => {
    $scope.postDetailsModal = modal;
    $scope.openPostDetails = (post) => {
      $scope.post = post;
      $scope.postDetailsModal.show();
    };
  });
});
