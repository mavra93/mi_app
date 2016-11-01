"use strict";
angular.module("miApp").controller("NewRoomController", function ($scope, parameters, ChatService, UserService) {
  $scope.roomUsers = [];
  $scope.room = {
    message: "",
    groupName: ""
  };

  $scope.closeModal = () => {
    $scope.removeModal();
  };

  let checkPrivateChat = () => {
    if ($scope.currentUser.privateChats && $scope.roomUsers.length === 2) {
      return ($scope.currentUser.privateChats.indexOf($scope.roomUsers[1]) > -1);
    }
  };

  $scope.createRoom = () => {
    if (!checkPrivateChat()) {
      ChatService.createRoom($scope.room, $scope.roomUsers, $scope.currentUser).then(()=> {
        if ($scope.roomUsers.length === 2) {
          ChatService.setPrivateChat($scope.roomUsers);
        }
      });
      $scope.removeModal();
    }
  };
  $scope.users = UserService.storeUsers();
  UserService.getCurrentUserData(parameters.id).then(data => {
    $scope.currentUser = data;
    $scope.roomUsers = [$scope.currentUser.uid];
  });

  $scope.selectUser = (id) => {
    $scope.roomUsers.push(id);
  }
});
