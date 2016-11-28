"use strict";
function GlobalService($q, $http) {

  let usersRef = firebase.database().ref("users/");

  this.encodeImage = (imageUri, callback) => {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      c.width = this.width;
      c.height = this.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL)
    };
    img.src = imageUri;
  };

  let getUsers = () => {
    let users = [];
    let deferred = $q.defer();
    usersRef.on("child_added", function (data) {
      users.push(data.val());
      deferred.resolve(users);
    });

    return deferred.promise;
  };

  this.sendNotification = (message, author, roomUsers) => {
    getUsers().then(users => {
      users.forEach(user => {
        roomUsers.forEach(roomUser => {
          if (user.uid === roomUser) {
            let notification = {
              "tokens": [user.deviceToken],
              "profile": "miapp",
              "notification": {
                "title": author.displayName,
                "message": message
              }
            };
            let config = {
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMjNhN2RmMS00Y2E4LTRiOWMtYmI4ZS04YjIxOTU3OGRmNDgifQ.uqdkHKmCm2rKrxzPOmA9IcYw24lSYeETIsYJ1q5AFBw"
              }
            };
            $http.post("https://api.ionic.io/push/notifications", notification, config)
              .success(function (data) {
                console.log(data);
              })
              .error(function (data) {
                console.log(data);
              });
          }
        })
      });
    })
  }
}
angular.module("miApp").service("GlobalService", GlobalService);

