"use strict";
function Auth($q) {
  let auth = firebase.auth();
  let defaultImage;
  this.encodeImage = (imageUri) => {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      c.width = this.width;
      c.height = this.height;
      ctx.drawImage(img, 0, 0);
      defaultImage = c.toDataURL("image/jpeg");
    };
    img.src = imageUri;
  };

  this.encodeImage("../image/avatar.png");

  /**
   * function which is creating a new user and saving them in firebase/users
   * @param email[String] - User email
   * @param password[String] - User password
   */
  this.createUser = function (email, password) {
    var q = $q.defer();
    auth.createUserWithEmailAndPassword(email, password).then(data => {
      q.resolve(data);
    }).catch(error => {
      q.reject(error);
    });
    return q.promise;
  };


  this.setUser = (id, username, email) => {
    firebase.database().ref('users/' + id).set({
      username: username,
      email: email,
      image: {
        path: defaultImage,
        name: "DefaultProfileImage.jpg"
      },
      uid: id
    });
  };

  this.setExtraUserSettings = (user, username) => {
    var q = $q.defer();
    user.updateProfile({
      photoURL: defaultImage,
      displayName: username
    }).then(() => {
      q.resolve(user);
    }, (error) => {
      q.reject(error);
    });
    return q.promise;
  };

  /**
   * Function which sign in user in application
   * @param email[String] - User email
   * @param password[String] - User password
   */

  this.login = (email, password) => {
    var q = $q.defer();
    auth.signInWithEmailAndPassword(email, password).then(data => {
      q.resolve(data);
    }).catch(error => {
      q.reject(error);
    });
    return q.promise;
  };

  this.logout = () => {
    var q = $q.defer();
    auth.signOut().then(data => {
      q.resolve(data);
    }, (error) => {
      q.reject(error);
    });
    return q.promise;
  }

}
angular.module("miApp").service("Auth", Auth);
