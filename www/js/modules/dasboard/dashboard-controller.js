'use strict';

angular.module('miApp').controller('DashboardCtrl', function ($scope, $state, Auth) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $scope.user = user.email;
    } else {
      $state.go("login");
    }
  });

  $scope.logout = () => {
    Auth.logout().then(()=> {
      $state.go("login");
    }).catch(error=> {

    });
  }

});
