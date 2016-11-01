"use strict";
angular.module("miApp").controller("RoomCtrl", function ($scope, parameters) {
  $scope.messages = parameters.room.messages;
});
