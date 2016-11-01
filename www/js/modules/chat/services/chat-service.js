"use strict";
function ChatService($q) {

  /**
   * @param room[Object] - New room object
   * @param users[Array] - Array of users that have permission to see this room
   * @param user[Object] - Room author object
   */

  this.createRoom = (room, users, user) => {
    let roomsRef = firebase.database().ref("rooms/");
    let q = $q.defer();
    let date = -moment().unix();
    roomsRef.push({
      name: room.groupName,
      created: date,
      author: user.uid,
      messages: [{
        message: room.message,
        created: date,
        author: user.uid
      }],
      users: users
    }).then(data => {
      q.resolve(data);
    });
    return q.promise
  };

  /**
   * @param usersId[Array] - Array of two user uid-s
   */

  this.setPrivateChat = (usersId) => {
    usersId.forEach((id, key) => {
      this.users.forEach(user => {
        if (user.uid === id) {
          if (!user.privateChats) {
            user.privateChats = [];
          }
          let idKey = key === 0 ? 1 : 0;
          user.privateChats.push(usersId[idKey]);
          firebase.database().ref("users/" + user.uid).update({
            privateChats: user.privateChats
          });
        }
      })
    })
  };

}
angular.module("miApp").service("ChatService", ChatService);
