"use strict";

angular.module("miApp").controller("SettingsCtrl", function ($scope, $state, UserService, localStorageService) {


  $scope.logout = () => {
    UserService.logout().then(()=> {
      localStorageService.remove("user");
      $state.go("login");
    })
  }

});
