"use strict";
angular.module("miApp").controller("RoomCtrl", function ($scope, parameters, ChatService, GlobalService, $ionicScrollDelegate, $timeout) {
  let messageRef = ChatService.getMessageRef(parameters.room.$id);
  let scrollRef = new firebase.util.Scroll(messageRef, "created");
  let unshift;

  $scope.user = parameters.user;

  $scope.getMessageAuthorPhoto = (uid) => {
    for (let i = 0; i < parameters.users; i++) {
      if (parameters.users[i].uid === uid) {
        return parameters.users[i].image.path;
      }
    }
  };

  $scope.messages = [];

  let scrollBottom = () => {
    // Scroll to the bottom
    $timeout(function () {
      let scroller = document.getElementById("chat-messages");
      scroller.scrollTop = scroller.scrollHeight;
    }, 0, false);

  };

  scrollRef.on("child_added", messages => {
    let message = messages.val();
    let newMessage;
    if ($scope.messages.length > 0) {
      newMessage = message.created * -1 > $scope.messages[$scope.messages.length - 1].created * -1;
    }
    if (unshift && !newMessage) {
      $scope.messages.unshift(message);
    } else if (newMessage) {
      $scope.messages.push(message);
    }
    $scope.$applyAsync();
    scrollBottom();
  });

  $scope.loadMore = (unshiftValue) => {
    unshift = unshiftValue;
    scrollRef.scroll.next(8);
  };

  $scope.loadMore(true);


  //Add new message
  $scope.newMessage = (message) => {
    unshift = false;
    ChatService.newMessage(parameters.room.$id, parameters.user, message);
    GlobalService.sendNotification(message, parameters.user, parameters.room.users);
    $scope.message = "";
  };

});
