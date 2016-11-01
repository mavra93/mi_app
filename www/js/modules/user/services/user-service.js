"use strict";
function UserService($q, $cordovaCamera, $translate, localStorageService, amMoment) {
  this.user = null;
  this.users = null;
  this.language = null;
  this.getCurrentUser = () => {
    let q = $q.defer();
    let observer = user => {
      this.user = user;
      q.resolve(user);
      unsubscribe();
    };
    let unsubscribe = firebase.auth().onAuthStateChanged(observer);
    return q.promise;
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

  this.storeUsers = () => {
    let users = [];
    firebase.database().ref("users/").on("child_added", data => {
      users.push(data.val());
      this.users = users;
    });
    return users;
  };

  this.getCurrentUserData = (id) => {
    let q = $q.defer();
    let usersRef = firebase.database().ref("users/");
    usersRef.orderByChild("uid").equalTo(id).on("child_added", data => {
      q.resolve(data.val());
    });
    return q.promise
  };

  let postsRef = firebase.database().ref("posts/");
  this.loadUserPosts = (user) => {
    let posts = [];
    let images = [];
    let q = $q.defer();
    postsRef.orderByChild("uid").equalTo(user.uid).on('child_added', data => {
      let post = data.val();
      if (post.image) {
        images.push(post.image)
      }
      posts.push(post);
      let returnData = {
        posts: posts,
        images: images
      };
      q.resolve(returnData);
    });
    return q.promise
  };

  this.updateProfile = (user) => {
    let q = $q.defer();
    this.user.updateProfile(user).then(data => {
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
  };

  this.setLanguage = (language) => {
    this.language = language;
    $translate.use(language);
    amMoment.changeLocale(language);
    localStorageService.set("language", language);
  };

  this.getLanguage = () => {
    return this.language;
  }
}
angular.module("miApp").service("UserService", UserService);
