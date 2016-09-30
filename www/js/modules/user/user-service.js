"use strict";
function UserService($q, $cordovaCamera) {
  this.getCurrentUser = () => {
    let q = $q.defer();
    firebase.auth().onAuthStateChanged(data => {
      q.resolve(data)
    });
    return q.promise
  };


  this.getProfileImage = () => {
    let q = $q.defer();
    let options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      correctOrientation: true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false
    };
    $cordovaCamera.getPicture(options).then(data => {
      q.resolve("data:image/jpeg;base64," + data)
    }).catch(err => {
      q.reject(err);
    });
    return q.promise
  };

  this.setUser = (user) => {
    firebase.database().ref("users/" + user.uid).update({
      username: user.displayName,
      image: {
        path: user.photoURL
      }
    });
  };

  this.updateProfile = (user) => {
    let q = $q.defer();
    user.updateProfile(user).then(data => {
      q.resolve(data)
    }, function (error) {
      q.reject(error);
    });
    return q.promise
  };

  this.logout = () => {
    let q = $q.defer();
    firebase.auth().signOut().then((data)=> {
      q.resolve(data)
    }, error => {
      q.reject(error);
    });
    return q.promise
  }
}
angular.module("miApp").service("UserService", UserService);
