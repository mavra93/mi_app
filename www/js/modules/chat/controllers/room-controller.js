"use strict";
angular.module("miApp").controller("RoomCtrl", function ($scope, parameters, ChatService, $ionicScrollDelegate, $timeout) {
  let messageRef = ChatService.getMessageRef(parameters.room.$id);
  let scrollRef = new firebase.util.Scroll(messageRef, "$key");

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
    $scope.hasMoreData = true;
    $scope.messages.push(message);

    $scope.$broadcast("scroll.infiniteScrollComplete");
    $scope.$applyAsync();
    scrollBottom();
  });

  $scope.loadMore = () => {
    if ($scope.messages.length < 1) {
      $scope.hasMoreData = true;
    } else {
      $scope.hasMoreData = false;
    }
    scrollRef.scroll.next(8);

  };

  $scope.loadMore();


  //Add new message
  $scope.newMessage = (message) => {
    ChatService.newMessage(parameters.room.$id, parameters.user, message, $scope.messages.length);
    $scope.message = "";
  };

});
