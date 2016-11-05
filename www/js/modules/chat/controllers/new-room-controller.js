"use strict";
angular.module("miApp").controller("NewRoomController", function ($scope, parameters, ChatService, UserService) {
  $scope.roomUsers = [];
  $scope.room = {
    message: "",
    groupName: ""
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
          UserService.setPrivateChat($scope.roomUsers);
        }
      });
      $scope.removeModal();
    } else {
      alert("You already have chat with this person");
    }
  };
  $scope.users = UserService.storeUsers();
  UserService.getCurrentUserData(parameters.id).then(data => {
    $scope.currentUser = data;
    $scope.roomUsers = [$scope.currentUser.uid];
  });

  $scope.selectUser = (user) => {
    if (user.selected) {
      $scope.roomUsers.forEach((userId, key) => {
        if (userId === user.uid) {
          user.selected = false;
          $scope.roomUsers.splice(key, 1);
        }
      })
    } else {
      user.selected = true;
      $scope.roomUsers.push(user.uid);
    }
  }
});
