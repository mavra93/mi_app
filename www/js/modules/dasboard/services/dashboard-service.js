"use strict";
function DashboardService($q, $cordovaCamera) {
  let postsRef = firebase.database().ref("posts/");
  this.newPost = (post, uid) => {
    let q = $q.defer();
    postsRef.push({
      title: post.title,
      message: post.message,
      image: post.image || null,
      uid: uid,
      created: -(moment().unix()),
      numberOfComments: post.numberOfComments
    }).then(data => {
      q.resolve(data);
    });
    return q.promise
  };

  this.addImage = (type) => {
    let q = $q.defer();
    let options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType[type],
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

  this.newComment = (post, uid, comment, commentsLength) => {
    let commentsRef = firebase.database().ref("posts/" + post.$id + "/comments");
    commentsRef.push({
      message: comment.message,
      uid: uid,
      created: -(moment().unix())
    });
    let postRef = firebase.database().ref("posts/" + post.$id);
    postRef.update({numberOfComments: commentsLength + 1});
  };


}
angular.module("miApp").service("DashboardService", DashboardService);
