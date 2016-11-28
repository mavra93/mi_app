"use strict";
angular.module("miApp").controller("RoomsListController", function ($scope, ModalService, UserService, $timeout, ionicMaterialMotion, ionicMaterialInk) {

  ionicMaterialInk.displayEffect();

  $scope.newRoom = () => {
    newRoom = true;
    ModalService.show("templates/modules/chat/new_room_template.html", "NewRoomController", {
        id: user.uid
      })
      .then(function (result) {
        if (!result) {

        } else {
          console.log(result);
        }
      });
  };

  $scope.openRoom = (room) => {
    ModalService.show("templates/modules/chat/room_template.html", "RoomCtrl", {
        room: room,
        user: user,
        users: allUsers
      })
      .then(function (result) {
        if (!result) {

        } else {
          console.log(result);
        }
      });
  };

  $scope.rooms = [];
  let user = UserService.user;
  let allUsers = UserService.users || UserService.storeUsers();

  UserService.getCurrentUser().then(data => {
    user = data
  });

  let newRoom = false;
  let roomsRef = firebase.database().ref("rooms/");
  let scrollRef = new firebase.util.Scroll(roomsRef, "created");

  let usersContains = (users) => {
    return (users.indexOf(user.uid) > -1);
  };

  let getRoomUser = (usersUid) => {
    for (let i = 0; i < allUsers.length; i++) {
      for (let x = 0; x < usersUid.length; x++) {
        if (allUsers[i].uid === usersUid[x] && user.uid !== usersUid[x]) {
          return allUsers[i];
        }
      }

    }
  };

  let getLastMessage = (messages) => {
    return messages[Object.keys(messages)[Object.keys(messages).length - 1]];
  };

  scrollRef.on("child_added", rooms => {
    let room = rooms.val();
    if (usersContains(room.users)) {
      $scope.hasMoreData = true;
      room.$id = rooms.key;
      room.lastMessage = getLastMessage(room.messages);
      if (room.users.length < 3) {
        let roomUser = getRoomUser(room.users);
        room.name = roomUser.username;
        room.image = roomUser.image.path;
      }
      if (newRoom) {
        $scope.rooms.unshift(room);
      } else {
        $scope.rooms.push(room);
      }

      $scope.$broadcast("scroll.infiniteScrollComplete");
      $scope.$applyAsync();
      newRoom = false;
      $timeout(()=> {
        ionicMaterialMotion.ripple({
          selector: '.animate-ripple .item'
        });
      }, 200);
    }
  });

  roomsRef.on("child_changed", (data) => {
    $scope.rooms.forEach(room => {
      if (data.key === room.$id) {
        room.messages = data.val().messages;
        room.lastMessage = getLastMessage(room.messages);
        $scope.$applyAsync();
      }
    })
  });


  //Load 8 more rooms
  $scope.loadMore = () => {
    $scope.hasMoreData = $scope.rooms.length < 1;
    scrollRef.scroll.next(8);
  };

  $scope.loadMore();

});
