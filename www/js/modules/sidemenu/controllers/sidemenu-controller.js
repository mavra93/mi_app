'use strict';
angular.module('miApp').controller('SidemenuCtrl', function ($scope, UserService) {
  UserService.storeUsers();
});
