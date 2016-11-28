"use strict";
function ChatService($q) {

  let database = firebase.database();

  this.getMessageRef = (id) => {
    return database.ref("rooms/" + id + "/messages");
  };

  /**
   * @param room[Object] - New room object
   * @param users[Array] - Array of users that have permission to see this room
   * @param user[Object] - Room author object
   */

  this.createRoom = (room, users, user) => {
    let roomsRef = database.ref("rooms/");
    let q = $q.defer();
    let date = -moment().unix();
    roomsRef.push({
      name: room.groupName,
      created: date,
      author: user.uid,
      image: room.image,
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
   * @param roomId[string] - Room unique id
   * @param user[object] - Message author
   * @param message[string]
   */


  this.newMessage = (roomId, user, message) => {
    let messageRef = this.getMessageRef(roomId);
    messageRef.push({
      message: message,
      created: -moment().unix(),
      author: user.uid
    });
  };

}
angular.module("miApp").service("ChatService", ChatService);
