'use strict';
angular.module('miApp').controller('TabsController', function ($scope, UserService) {
  UserService.storeUsers();
});
