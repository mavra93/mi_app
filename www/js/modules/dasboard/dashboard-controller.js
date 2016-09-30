"use strict";
angular.module("miApp").controller("DashboardCtrl", function ($scope, $state, Auth) {
  let observer = user => {
    if (user) {
      let userProfile = user;
      if (!user.photoURL) {
        let username = $state.params.username;
        Auth.setExtraUserSettings(user, username).then(newUser => {
          userProfile = newUser;
        });
      }
      $scope.user = userProfile;
    } else {
      $state.go("login");
    }
    unsubscribe();
  };
  let unsubscribe = firebase.auth().onAuthStateChanged(observer);


  $scope.logout = () => {
    Auth.logout().then(()=> {
      $state.go("login");
    }).catch(error=> {

    });
  }
});
